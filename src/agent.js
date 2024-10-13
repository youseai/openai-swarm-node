class Agent {
    constructor({ name, instructions, tools = [] }) {
      this.name = name;
      this.instructions = instructions;
      this.tools = tools;
    }
  }
  
  module.exports = Agent;