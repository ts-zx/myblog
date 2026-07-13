declare module "rss" {
  interface ItemOptions {
    title: string;
    description?: string;
    url?: string;
    guid?: string;
    date?: Date;
    categories?: string[] | string;
    author?: string;
    [key: string]: unknown;
  }

  interface FeedOptions {
    title: string;
    description: string;
    site_url?: string;
    feed_url?: string;
    image_url?: string;
    language?: string;
    pubDate?: Date;
    ttl?: number;
    [key: string]: unknown;
  }

  export default class RSS {
    constructor(options: FeedOptions);
    item(options: ItemOptions): void;
    xml(options?: { indent?: boolean }): string;
  }
}