
class Swarm {
  constructor(apiKey) {
    this.client = new OpenAIApi(new Configuration({ apiKey }));
  }

  async run({ agent, messages, contextVariables = {}, maxTurns = Infinity, debug = false }) {
    let currentAgent = agent;
    let numTurns = 0;

    while (numTurns < maxTurns) {
      // Generate the response from the current agent
      const response = await this.client.createChatCompletion({
        model: currentAgent.model || "gpt-4",
        messages: [
          { role: "system", content: currentAgent.instructions },
          ...messages,
        ],
      });

      const message = response.data.choices[0].message;
      messages.push(message);

      if (debug) console.log(`${currentAgent.name}:`, message.content);

      // Handle any tool calls
      if (message.tool_calls && currentAgent.tools) {
        for (const toolCall of message.tool_calls) {
          const result = this.executeTool(toolCall, currentAgent.tools, contextVariables);
          messages.push({ role: "tool", content: result });
        }
      }

      // If no more tool calls or agent handoffs, break the loop
      if (!message.tool_calls || numTurns >= maxTurns) {
        break;
      }

      numTurns++;
    }

    return { agent: currentAgent, messages };
  }

  executeTool(toolCall, tools, contextVariables) {
    const tool = tools.find(t => t.name === toolCall.function.name);
    if (tool) {
      return tool.fn(contextVariables, ...Object.values(toolCall.function.arguments));
    }
    return null;
  }
}

module.exports = Swarm;
