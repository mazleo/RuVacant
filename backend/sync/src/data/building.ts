import { ResponseType } from "./response_type.js";

/**
 * Data class for Rutgers buildings.
 */
export class Building implements ResponseType {
  public code: string | undefined | null;
  public name: string | undefined | null;

  serializeJson(): object | undefined {
    return this.isOfInterest() ? {
      code: this.code,
      name: this.name,
    } : undefined;
  }

  deserializeJson(object : any): Building | undefined {
    this.code = object.code !== null ? object.code : undefined;
    this.name = object.name !== null ? object.name : undefined;
    return this.isOfInterest() ? this : undefined;
  }

  isOfInterest(): boolean {
    return this.code !== undefined && this.name !== undefined;
  }
}
