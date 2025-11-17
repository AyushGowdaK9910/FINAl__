declare module 'swagger-ui-react' {
  import { Component } from 'react';

  export interface SwaggerUIProps {
    spec?: any;
    url?: string;
    onComplete?: (system: any) => void;
    requestInterceptor?: (request: any) => any;
    responseInterceptor?: (response: any) => any;
    [key: string]: any;
  }

  export default class SwaggerUI extends Component<SwaggerUIProps> {}
}

declare module 'swagger-ui-react/swagger-ui.css' {
  const content: string;
  export default content;
}

