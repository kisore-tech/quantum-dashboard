export class ChatAgent {
  constructor(apiKey, instructions) {
    this.apiKey = "AIzaSyB0fyGtun-HA8hCs_EkkVt-0R_HUyyb2Ls";
    this.conversationHistory = instructions + "\n" + ` backends: [
    { name: "ibmq_qasm_simulator", status: "Available", qubits: 0, queue: 2, version: "2.0.1" },
    { name: "ibmq_manila",           status: "Busy",      qubits: 5, queue: 14, version: "1.8.3" },
    { name: "ibmq_quito",            status: "Available", qubits: 5, queue: 3,  version: "1.8.2" },
    { name: "ibmq_belem",            status: "Maintenance", qubits: 5, queue: 0, version: "1.6.9" }
  ],
  jobs: [
    { id: "job_123", status: "Completed", backend: "ibmq_qasm_simulator", submittedAt: "2025-08-24T10:12:00Z", shots: 1024 },
    { id: "job_124", status: "Running",   backend: "ibmq_manila",          submittedAt: "2025-08-25T06:05:00Z", shots: 4096 },
    { id: "job_125", status: "Failed",    backend: "ibmq_quito",           submittedAt: "2025-08-22T14:31:00Z", shots: 1024 },
    { id: "job_126", status: "Queued",    backend: "ibmq_manila",          submittedAt: "2025-08-25T21:40:00Z", shots: 8192 }
  ],
  sessions: [
    { id: "session_001", status: "Active", startedAt: "2025-08-25T09:10:00Z" },
    { id: "session_002", status: "Closed", startedAt: "2025-08-20T10:22:00Z" }
  ],
  endpoints: [
    { method: "GET",  path: "/v1/backends",  desc: "List available quantum backends and their status" },
    { method: "GET",  path: "/v1/jobs",      desc: "Retrieve recent quantum jobs" },
    { method: "POST", path: "/v1/jobs",      desc: "Submit a new quantum job" },
    { method: "GET",  path: "/v1/sessions",  desc: "Manage sessions for iterative workloads" }
  ],`;
  }

  async sendMessage(message) {
    // Append user message to conversation history
    this.conversationHistory += `User: ${message}\n `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: this.conversationHistory,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return `Error: ${response.status} - ${errorText}`;
    }

    const data = await response.json();

    // Extract text safely from Gemini response
    const outputText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Append assistant response to conversation history
    this.conversationHistory += `Assistant: ${outputText}\n`;

    return outputText;
  }
}

// Example usage:
// const apiKey = "YOUR_GEMINI_API_KEY";
// const instructions = "You are a helpful assistant.";
// const agent = new ChatAgent(apiKey, instructions);
// agent.sendMessage("Hello, how are you?").then((response) => console.log(response));










