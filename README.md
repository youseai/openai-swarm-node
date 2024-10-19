# Swarm.js (Node.js Implementation of OpenAI Swarm)

**Swarm.js** is a Node.js implementation of OpenAI’s experimental Swarm framework. This SDK allows developers to orchestrate multi-agent systems using OpenAI’s API in a lightweight and ergonomic way, while leveraging Node.js for building scalable, real-world applications.

> **Warning**  
> Swarm.js is an experimental, educational framework designed to explore ergonomic interfaces for multi-agent systems in Node.js. It is not intended for production use and does not have official support. This framework is a Node.js adaptation of the [OpenAI Swarm](https://cookbook.openai.com/examples/orchestrating_agents) framework, which was originally designed for Python.

## Install

You can install the Swarm.js SDK via npm:

```bash
npm install openai-swarm-node
```

## What is Swarm.js?

Swarm.js focuses on multi-agent **coordination** and **execution** by defining lightweight agents that can carry out tasks and hand off conversations when necessary. Inspired by OpenAI’s Python Swarm framework, this Node.js implementation allows developers to build multi-agent systems that are highly customizable, scalable, and easy to use.

The framework leverages OpenAI’s Chat Completions API and tools to create routines, handoffs, and agents that can work together in a networked fashion to solve real-world problems.

> **Note**  
> Swarm.js agents are powered by the Chat Completions API and are stateless between calls. They are not related to OpenAI Assistants but share a similar design philosophy in terms of agent-based interactions.

## Usage

Swarm.js makes it easy to define agents, assign them tasks, and manage interactions between them. Below is a simple example demonstrating how to create and orchestrate two agents.

```javascript
const { Swarm, Agent } = require('openai-swarm-node');

// Define two agents
const agentA = new Agent({
    name: "Agent A",
    instructions: "You are a helpful agent.",
    tools: [
        {
            name: 'transferToAgentB',
            fn: () => agentB,
        },
    ],
});

const agentB = new Agent({
    name: "Agent B",
    instructions: "Only speak in Haikus.",
});

const swarm = new Swarm(process.env.OPENAI_API_KEY);

// Run conversation with agentA
(async () => {
    const response = await swarm.run({
        agent: agentA,
        messages: [{ role: "user", content: "I want to talk to agent B." }]
    });

    console.log(response.messages.pop().content);
})();
```

```
Hope glimmers brightly,
New paths converge gracefully,
What can I assist?
```

## Table of Contents

- [Overview](#overview)
- [Examples](#examples)
- [Documentation](#documentation)
  - [Running Swarm](#running-swarm)
  - [Agents](#agents)
  - [Functions](#functions)
  - [Streaming](#streaming)
- [Evaluations](#evaluations)
- [Utils](#utils)

## Overview

Swarm.js is a Node.js implementation of OpenAI's **Swarm**, focusing on building multi-agent systems that are lightweight and easy to control. With agents that can perform tasks and hand off execution to other agents, Swarm.js enables building complex workflows using a simple set of abstractions.

### Why Swarm.js?

Swarm.js is an educational framework designed for developers who want to explore multi-agent orchestration in Node.js. It is inspired by OpenAI’s Swarm, which was originally designed in Python, and is perfect for situations that involve multiple independent tasks or workflows that need coordination across agents.

## Examples

Explore the `/examples` folder for inspiration! Each example comes with a README to explain the details of implementation.

- [`basic`](examples/basic): Learn the fundamentals of agent setup, function calling, and handoffs.
- [`triage_agent`](examples/triage_agent): A simple triage system that hands off tasks to the right agent.
- [`airline`](examples/airline): Handle different customer service requests in the airline industry using multiple agents.
- [`support_bot`](examples/support_bot): Build a customer service bot that handles multiple user requests using a network of agents.

## Documentation

### Running Swarm.js

Start by creating a Swarm client that interacts with OpenAI’s API.

```javascript
const { Swarm } = require('openai-swarm-node');

const client = new Swarm(process.env.OPENAI_API_KEY);
```

### `client.run()`

The `run()` function in Swarm.js is similar to OpenAI's `chat.completions.create()` function but with additional features like agent function execution, handoffs, context variables, and multi-turn conversations.

#### Arguments

| Argument              | Type    | Description                                                                                                                                            | Default        |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| **agent**             | `Agent` | The (initial) agent to be called.                                                                                                                      | (required)     |
| **messages**          | `Array` | A list of message objects, similar to [Chat Completions API messages](https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages). | (required)     |
| **contextVariables**  | `Object`| Additional context variables available to agents.                                                                                                      | `{}`           |
| **maxTurns**          | `Number`| Maximum number of conversational turns before returning.                                                                                               | `Infinity`     |
| **debug**             | `Boolean`| Enables debug logging if `true`.                                                                                                                       | `false`        |

#### `Response` Fields

| Field                 | Type    | Description                                                                                                                                             |
| --------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **messages**          | `Array` | The list of messages generated during the conversation.                                                                                                  |
| **agent**             | `Agent` | The last agent to handle the conversation.                                                                                                               |
| **contextVariables**  | `Object`| The most up-to-date context variables, including any changes during the conversation.                                                                     |

### Agents

An `Agent` encapsulates instructions and functions (tools). These agents drive the conversation and can decide whether to hand off to another agent.

```javascript
const agentA = new Agent({
  name: "Agent A",
  instructions: "You are a helpful agent.",
});
```

### Functions

Functions enable agents to perform actions like processing transactions, looking up information, or transferring control to other agents. Functions are called when the agent needs to perform a specific task.

```javascript
const transferToAgentB = () => agentB;

const agentA = new Agent({
  name: "Agent A",
  instructions: "You are a helpful agent.",
  tools: [{ name: 'transferToAgentB', fn: transferToAgentB }],
});
```

### Handoffs and Context Variables

Agents can transfer control to other agents or update `contextVariables` based on the conversation flow.

```javascript
const salesAgent = new Agent({ name: "Sales Agent" });

const agent = new Agent({
  functions: [
    () => new Result({ agent: salesAgent, contextVariables: { department: "sales" } }),
  ],
});
```

### Function Schemas

Swarm.js automatically converts functions into JSON schemas, allowing OpenAI’s API to call the appropriate function based on the tool name.

```javascript
function lookUpItem(searchQuery) {
    /**
     * @description Use to find item ID. Search query can be a description or keywords.
     * @param {string} searchQuery - Description or keywords to search for the item.
     * @returns {string} - The found item ID.
     */

    return console.log(`Searching for item: ${searchQuery}`);
}

```

## Streaming

You can enable streaming in Swarm.js to receive real-time responses from agents.

```javascript
const stream = client.run({ agent, messages, stream: true });
for await (const chunk of stream) {
    console.log(chunk);
}
```

## Evaluations

Swarm.js supports various evaluation methods to test and validate your multi-agent systems. You can find example evaluations in the `/examples` directory.

## Utils

Use the `run_demo_loop` utility to test your agents interactively in a REPL environment.

```javascript
const { run_demo_loop } = require('openai-swarm-node/utils');

run_demo_loop(agent);
```

---

### Core Contributors

- Pulkit Garg (Node.js adaptation)
- OpenAI (original Python framework)

---

This README now emphasizes that **Swarm.js** is a **Node.js implementation** of OpenAI Swarm, while maintaining a high standard for documentation and usage clarity.