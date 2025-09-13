export class HttpRequestOptions {
  readonly method: string;
  readonly port: number;
  readonly hostname: string;
  readonly path: string;
  readonly headers: Map<string, string>;
  readonly queries: Map<string, string>;

  constructor(
    method: string,
    port: number,
    hostname: string,
    path: string,
    headers: Map<string, string>,
    queries: Map<string, string>,
  ) {
    this.method = method;
    this.port = port;
    this.hostname = hostname;
    this.path = path;
    this.headers = headers;
    this.queries = queries;
  }

  public static Builder(): Builder {
    return new Builder();
  }

  public getOptions(): object {
    return {
      hostname: this.hostname,
      port: this.port,
      path: `${this.path}?${new URLSearchParams(
        Object.fromEntries(this.queries),
      ).toString()}`,
      method: this.method,
      headers: Object.fromEntries(this.headers),
    };
  }
}

class Builder {
  private method: string;
  private port: number;
  private hostname: string;
  private path: string;
  private headers: Map<string, string>;
  private queries: Map<string, string>;

  constructor() {
    this.method = 'GET';
    this.port = 8080;
    this.hostname = '';
    this.path = '';
    this.headers = new Map();
    this.queries = new Map();
  }

  setMethod(method: string): Builder {
    this.method = method;
    return this;
  }

  setHostname(hostname: string): Builder {
    this.hostname = hostname;
    return this;
  }

  setPort(port: number): Builder {
    this.port = port;
    return this;
  }

  setPath(path: string): Builder {
    this.path = path;
    return this;
  }

  addHeader(name: string, value: string): Builder {
    this.headers.set(name, value);
    return this;
  }

  setDefaultHeaders(): Builder {
    this.addHeader('Content-Type', 'application/json');
    return this;
  }

  addQuery(name: string, value: string): Builder {
    this.queries.set(name, value);
    return this;
  }

  build(): HttpRequestOptions {
    return new HttpRequestOptions(
      this.method,
      this.port,
      this.hostname,
      this.path,
      this.headers,
      this.queries,
    );
  }
}
