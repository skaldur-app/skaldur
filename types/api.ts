// API request and response types

export interface ImprovePromptRequest {
  sessionUUID: string;
  userInput: string;
  improvementTypeId: string;
  improvementStyle: string;
}

export interface ImprovePromptResponse {
  improvedPrompt: string;
  sessionUUID: string;
}

export interface NameSessionRequest {
  sessionUUID: string;
  initialPrompt: string;
  firstResponse: string;
}

export interface NameSessionResponse {
  sessionName: string;
  sessionUUID: string;
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
  };
}