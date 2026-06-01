#!/bin/bash
#
# NUS Deployment Script for Next.js (PRISM) Site
# Deploys to: https://www.comp.nus.edu.sg/~yfei11/
#
# Usage:
#   ./deploy_nus.sh          # Build + upload
#   ./deploy_nus.sh build    # Build only (no upload)
#   ./deploy_nus.sh upload   # Upload only (skip build, use existing out/)
#

set -e

# ============================================================
# Configuration
# ============================================================
NUS_USER="yfei11"
NUS_HOST="stu.comp.nus.edu.sg"
NUS_PATH="/home/${NUS_USER}/public_html"
BASE_PATH="/~yfei11"
OUT_DIR="out"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================================
# Step 1: Build with NUS basePath
# ============================================================
do_build() {
    log_info "=== Step 1: Building Next.js site with basePath=${BASE_PATH} ==="

    # Clean previous build
    rm -rf .next "${OUT_DIR}"
    log_ok "Cleaned .next/ and ${OUT_DIR}/"

    # Build with NUS_DEPLOY flag
    # basePath and assetPrefix are set in next.config.ts when NUS_DEPLOY=true
    NUS_DEPLOY=true npx next build
    log_ok "Next.js build completed → ${OUT_DIR}/"

    # Verify output directory exists
    if [ ! -d "${OUT_DIR}" ]; then
        log_error "Build failed: ${OUT_DIR}/ directory not found!"
        exit 1
    fi

    # ============================================================
    # Step 2: Post-process — fix raw paths not handled by basePath
    # ============================================================
    log_info "=== Step 2: Post-processing paths in ${OUT_DIR}/ ==="

    # Fix HTML files: src="/...", href="/..." (but NOT href="//..." or src="//..." which are protocol-relative URLs)
    # Also skip href="/~yfei11" which is already prefixed by Next.js basePath
    find "${OUT_DIR}" -name "*.html" -type f | while read -r file; do
        # src="/..." → src="/~yfei11/..."  (skip src="//" and already-prefixed paths)
        sed -i '' -E "s|src=\"/${BASE_PATH#/}|src=\"${BASE_PATH}|g" "$file" 2>/dev/null || true
        sed -i '' -E "s|src=\"/([^/~\"])|src=\"${BASE_PATH}/\1|g" "$file"

        # href="/..." → href="/~yfei11/..."  (skip href="//" and href="/~yfei11" and href="/#")
        sed -i '' -E "s|href=\"/([^/~\"#])|href=\"${BASE_PATH}/\1|g" "$file"

        # Special case: href="/" (homepage) → href="/~yfei11/"
        sed -i '' -E "s|href=\"/\"|href=\"${BASE_PATH}/\"|g" "$file"

        # CSS url(/...) inside <style> tags in HTML
        sed -i '' -E "s|url\(/([^/~)\"'])|url(${BASE_PATH}/\1|g" "$file"
    done
    log_ok "Fixed paths in HTML files"

    # Fix CSS files
    find "${OUT_DIR}" -name "*.css" -type f | while read -r file; do
        sed -i '' -E "s|url\(/([^/~)\"'])|url(${BASE_PATH}/\1|g" "$file"
    done
    log_ok "Fixed paths in CSS files"

    # Fix JSON files (e.g., manifest, redirects)
    find "${OUT_DIR}" -name "*.json" -type f | while read -r file; do
        sed -i '' -E "s|\"\/([^~\/\"])|\"${BASE_PATH}/\1|g" "$file" 2>/dev/null || true
    done
    log_ok "Fixed paths in JSON files"

    # ============================================================
    # Step 3: Verify key paths
    # ============================================================
    log_info "=== Step 3: Verification ==="

    # Check a sample HTML file for correct paths
    SAMPLE_FILE="${OUT_DIR}/index.html"
    if [ -f "${SAMPLE_FILE}" ]; then
        # Count remaining unpatched paths (src="/ or href="/ that aren't basePath)
        UNPATCHED=$(grep -oE '(src|href)="\/[^~]' "${SAMPLE_FILE}" 2>/dev/null | wc -l | tr -d ' ')
        if [ "${UNPATCHED}" -gt 0 ]; then
            log_warn "Found ${UNPATCHED} potentially unpatched paths in index.html"
            grep -n '(src|href)="/[^~]' "${SAMPLE_FILE}" 2>/dev/null | head -5 || true
        else
            log_ok "All paths in index.html appear correctly prefixed"
        fi
    fi

    # Check that _next assets have basePath prefix
    if [ -d "${OUT_DIR}/_next" ]; then
        log_ok "_next/ directory present in ${OUT_DIR}/"
    fi

    # Check PDF exists
    if [ -f "${OUT_DIR}/cv/Yang_Fei_CV_2025.pdf" ]; then
        log_ok "CV PDF found at ${OUT_DIR}/cv/Yang_Fei_CV_2025.pdf"
    else
        log_warn "CV PDF not found - check public/cv/ directory"
    fi

    # Count total files
    TOTAL_FILES=$(find "${OUT_DIR}" -type f | wc -l | tr -d ' ')
    TOTAL_SIZE=$(du -sh "${OUT_DIR}" | cut -f1)
    log_ok "Build complete: ${TOTAL_FILES} files, ${TOTAL_SIZE} total"
}

# ============================================================
# Step 4: Upload to NUS server
# ============================================================
do_upload() {
    log_info "=== Step 4: Uploading to ${NUS_USER}@${NUS_HOST}:${NUS_PATH} ==="

    if [ ! -d "${OUT_DIR}" ]; then
        log_error "${OUT_DIR}/ directory not found! Run build first."
        exit 1
    fi

    # Confirm before upload
    echo ""
    echo -e "  ${YELLOW}Target:${NC}  ${NUS_USER}@${NUS_HOST}:${NUS_PATH}"
    echo -e "  ${YELLOW}Source:${NC}  ${OUT_DIR}/ ($(find "${OUT_DIR}" -type f | wc -l | tr -d ' ') files)"
    echo ""
    read -p "  Proceed with upload? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warn "Upload cancelled."
        exit 0
    fi

    # Create public_html if needed, then sync files
    ssh "${NUS_USER}@${NUS_HOST}" "mkdir -p ${NUS_PATH}"

    # Upload using rsync (preferred) or scp
    if command -v rsync &> /dev/null; then
        log_info "Using rsync for upload..."
        rsync -avz --delete \
            "${OUT_DIR}/" \
            "${NUS_USER}@${NUS_HOST}:${NUS_PATH}/"
    else
        log_info "Using scp for upload (rsync not available)..."
        scp -r "${OUT_DIR}/"* "${NUS_USER}@${NUS_HOST}:${NUS_PATH}/"
    fi
    log_ok "Files uploaded successfully"

    # Set correct permissions
    log_info "Setting file permissions..."
    ssh "${NUS_USER}@${NUS_HOST}" "
        chmod 711 ~/
        chmod 711 ${NUS_PATH}
        find ${NUS_PATH} -type d -exec chmod 711 {} \;
        find ${NUS_PATH} -type f -exec chmod 644 {} \;
    "
    log_ok "Permissions set (dirs: 711, files: 644)"

    echo ""
    log_ok "============================================"
    log_ok " Deployment complete!"
    log_ok " Visit: https://www.comp.nus.edu.sg/~yfei11/"
    log_ok "============================================"
}

# ============================================================
# Main
# ============================================================
MODE="${1:-all}"

case "${MODE}" in
    build)
        do_build
        ;;
    upload)
        do_upload
        ;;
    all|"")
        do_build
        do_upload
        ;;
    *)
        echo "Usage: $0 [build|upload|all]"
        echo "  build   - Build only (no upload)"
        echo "  upload  - Upload only (use existing out/)"
        echo "  all     - Build + upload (default)"
        exit 1
        ;;
esac
