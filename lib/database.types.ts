export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName: string;
          query: string;
          variables: Json;
          extensions: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      comments: {
        Row: {
          body: string;
          created_at: string | null;
          id: number;
          post_id: number | null;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string | null;
          id?: number;
          post_id?: number | null;
          user_id?: string;
        };
        Update: {
          body?: string;
          created_at?: string | null;
          id?: number;
          post_id?: number | null;
          user_id?: string;
        };
      };
      locales: {
        Row: {
          description: string | null;
          id: number;
          key: string;
          language: string;
          value: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          key: string;
          language: string;
          value: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          key?: string;
          language?: string;
          value?: string;
        };
      };
      nodes: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          title: string | null;
          type: string;
          world: string;
          x: number;
          y: number;
          z: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id: string;
          title?: string | null;
          type: string;
          world: string;
          x: number;
          y: number;
          z: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string | null;
          type?: string;
          world?: string;
          x?: number;
          y?: number;
          z?: number;
        };
      };
      players: {
        Row: {
          first_name: string;
          house_id: string;
          id: string;
          last_name: string;
          position_pitch: number;
          position_roll: number;
          position_world: string;
          position_x: number;
          position_y: number;
          position_yaw: number;
          position_z: number;
          updated_at: string;
          user_id: string;
          year: number;
        };
        Insert: {
          first_name: string;
          house_id: string;
          id: string;
          last_name: string;
          position_pitch: number;
          position_roll: number;
          position_world: string;
          position_x: number;
          position_y: number;
          position_yaw: number;
          position_z: number;
          updated_at?: string;
          user_id: string;
          year: number;
        };
        Update: {
          first_name?: string;
          house_id?: string;
          id?: string;
          last_name?: string;
          position_pitch?: number;
          position_roll?: number;
          position_world?: string;
          position_x?: number;
          position_y?: number;
          position_yaw?: number;
          position_z?: number;
          updated_at?: string;
          user_id?: string;
          year?: number;
        };
      };
      posts: {
        Row: {
          body: string | null;
          group_id: number | null;
          id: number;
          image: string | null;
          language: string;
          published: boolean;
          published_at: string | null;
          short: string | null;
          slug: string | null;
          title: string | null;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          group_id?: number | null;
          id?: number;
          image?: string | null;
          language?: string;
          published?: boolean;
          published_at?: string | null;
          short?: string | null;
          slug?: string | null;
          title?: string | null;
          user_id?: string;
        };
        Update: {
          body?: string | null;
          group_id?: number | null;
          id?: number;
          image?: string | null;
          language?: string;
          published?: boolean;
          published_at?: string | null;
          short?: string | null;
          slug?: string | null;
          title?: string | null;
          user_id?: string;
        };
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database['public']['Enums']['app_permission'];
          role: Database['public']['Enums']['app_role'];
        };
        Insert: {
          id?: number;
          permission: Database['public']['Enums']['app_permission'];
          role: Database['public']['Enums']['app_role'];
        };
        Update: {
          id?: number;
          permission?: Database['public']['Enums']['app_permission'];
          role?: Database['public']['Enums']['app_role'];
        };
      };
      user_roles: {
        Row: {
          id: number;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
      };
      users: {
        Row: {
          description: string | null;
          id: string;
          username: string;
        };
        Insert: {
          description?: string | null;
          id: string;
          username: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          username?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database['public']['Enums']['app_permission'];
          user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_permission:
        | 'users.delete'
        | 'users.edit'
        | 'posts.read'
        | 'posts.create'
        | 'posts.delete'
        | 'posts.edit'
        | 'posts.upload'
        | 'nodes.edit'
        | 'nodes.delete'
        | 'comments.edit'
        | 'comments.delete';
      app_role: 'admin' | 'moderator';
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: { size: number; bucket_id: string }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits: number;
          levels: number;
          offsets: number;
          search: string;
          sortcolumn: string;
          sortorder: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
