declare module '@qdrant/js-client-rest' {
  export class QdrantClient {
    constructor(options: { url: string });
    upsert(collectionName: string, points: any[]): Promise<any>;
    search(collectionName: string, query: any): Promise<any>;
    retrieve(collectionName: string, ids: number[]): Promise<any>;
  }
}