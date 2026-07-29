export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'pdf';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    logo?: string;
    logoText?: string;
    roles?: CardRole[];
}

export interface CardRole {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface PdfPageConfig extends BasePageConfig {
    type: 'pdf';
    source: string;
    download_filename?: string;
}
