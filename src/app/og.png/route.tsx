import fs from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import { getConfig } from '@/lib/config';
import { getPageConfig } from '@/lib/content';

// Link-preview card (Open Graph / Twitter), rendered once at build time.
export const dynamic = 'force-static';
const size = { width: 1200, height: 630 };

export function GET() {
    const config = getConfig();
    const about = getPageConfig<{ profile?: { research_interests?: string[] } }>('about');
    const interests = about?.profile?.research_interests ?? [];
    const avatar = fs.readFileSync(path.join(process.cwd(), 'public', config.author.avatar));
    const avatarSrc = `data:image/jpeg;base64,${avatar.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 70px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e0ecfb 100%)',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={avatarSrc}
                    width={260}
                    height={260}
                    style={{ borderRadius: 130, border: '8px solid white', boxShadow: '0 10px 30px rgba(15,23,42,0.15)' }}
                    alt=""
                />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 56 }}>
                    <div style={{ fontSize: 76, fontWeight: 700, color: '#0f172a' }}>{config.author.name}</div>
                    <div style={{ fontSize: 30, color: '#334155', marginTop: 12 }}>
                        {`PhD Student · ${config.author.institution}`}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 36, maxWidth: 720 }}>
                        {interests.map((t) => (
                            <div
                                key={t}
                                style={{
                                    fontSize: 24,
                                    color: '#1e40af',
                                    background: 'rgba(59,130,246,0.12)',
                                    borderRadius: 999,
                                    padding: '8px 20px',
                                    marginRight: 12,
                                    marginBottom: 12,
                                }}
                            >
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        size,
    );
}
