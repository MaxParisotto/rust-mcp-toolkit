declare module '@qdrant/js-client-rest' {
  export interface Point {
    id: number;
    vector?: number[];
    payload?: Record<string, unknown>;
  }

  export interface UpsertPointsParams {
    points: Point[];
  }

  export interface SearchParams {
    vector: {
      name: string;
      vector: number[];
    };
    limit: number;
    with_payload?: boolean;
    with_vectors?: boolean;
  }

  export interface GetPointParams {
    with_vectors?: boolean;
    with_payload?: boolean;
  }

  export interface CreateCollectionParams {
    vectors?: {
      size: number;
      distance: 'Cosine' | 'Euclid' | 'Dot';
    };
  }

  export class QdrantClient {
    constructor(options: { url: string });
    
    getPoint(collectionName: string, id: number | string, options?: GetPointParams): Promise<Point>;
    
    searchPoints(collectionName: string, params: SearchParams): Promise<Point[]>;
    
    createCollection(collectionName: string, params: CreateCollectionParams): Promise<void>;
    
    deleteCollection(collectionName: string): Promise<void>;
    
    upsertPoints(collectionName: string, params: UpsertPointsParams): Promise<void>;
  }
}