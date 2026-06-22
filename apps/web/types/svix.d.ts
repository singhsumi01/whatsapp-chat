declare module 'svix' {
  export class Webhook {
    constructor(secret: string);
    verify(
      payload: string,
      headers: {
        'svix-id': string;
        'svix-timestamp': string;
        'svix-signature': string;
      } | Record<string, string | null | undefined>
    ): any;
  }
}
