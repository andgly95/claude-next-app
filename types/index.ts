export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: Array<{
    text: string;
    type: string;
  }>;
  // Add other fields as needed based on the Anthropic API response
}
