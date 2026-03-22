// Base interfaces for common fields
export interface Timestamped {
  createdAt: Date;
  updatedAt?: Date;
}

export interface Creatable {
  createdAt: Date;
}
