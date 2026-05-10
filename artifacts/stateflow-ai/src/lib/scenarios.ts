import { FSM } from "./fsm-engine";

export const scenarios: Record<string, FSM> = {
  otp: {
    id: "otp",
    name: "OTP Authentication",
    description: "User authentication flow using a one-time password.",
    states: [
      { id: "S0", label: "Idle", isInitial: true },
      { id: "S1", label: "Wait OTP" },
      { id: "S2", label: "Verified" },
      { id: "S3", label: "Locked" }
    ],
    alphabet: ["login", "otp", "wrong", "reset"],
    transitions: [
      { from: "S0", to: "S1", input: "login" },
      { from: "S1", to: "S2", input: "otp" },
      { from: "S1", to: "S3", input: "wrong" },
      { from: "S2", to: "S0", input: "reset" },
      { from: "S3", to: "S0", input: "reset" }
    ],
    mooreOutputs: {
      "S0": "Welcome",
      "S1": "OTP Sent",
      "S2": "Access Granted",
      "S3": "Account Locked"
    },
    mealyOutputs: {
      "S0": { "login": "Send OTP SMS" },
      "S1": { "otp": "Grant Access", "wrong": "Lock Account" },
      "S2": { "reset": "Log Out" },
      "S3": { "reset": "Unlock Account" }
    },
    defaultSequence: ["login", "otp"]
  },
  ecommerce: {
    id: "ecommerce",
    name: "E-commerce Checkout",
    description: "Shopping cart checkout process.",
    states: [
      { id: "Cart", label: "Cart", isInitial: true },
      { id: "Shipping", label: "Shipping" },
      { id: "Payment", label: "Payment" },
      { id: "Success", label: "Success" }
    ],
    alphabet: ["checkout", "address", "pay", "fail"],
    transitions: [
      { from: "Cart", to: "Shipping", input: "checkout" },
      { from: "Shipping", to: "Payment", input: "address" },
      { from: "Payment", to: "Success", input: "pay" },
      { from: "Payment", to: "Cart", input: "fail" },
      { from: "Success", to: "Cart", input: "checkout" }
    ],
    mooreOutputs: {
      "Cart": "Viewing Cart",
      "Shipping": "Need Address",
      "Payment": "Processing",
      "Success": "Order Placed"
    },
    mealyOutputs: {
      "Cart": { "checkout": "Init Checkout" },
      "Shipping": { "address": "Calc Shipping" },
      "Payment": { "pay": "Charge Card", "fail": "Show Error" },
      "Success": { "checkout": "New Order" }
    },
    defaultSequence: ["checkout", "address", "pay"]
  },
  chatbot: {
    id: "chatbot",
    name: "Chatbot Greeting",
    description: "A customer service chatbot routing flow.",
    states: [
      { id: "Start", label: "Start", isInitial: true },
      { id: "Greet", label: "Greeting" },
      { id: "Menu", label: "Menu" },
      { id: "Agent", label: "Agent" },
      { id: "End", label: "End" }
    ],
    alphabet: ["hello", "options", "help", "bye"],
    transitions: [
      { from: "Start", to: "Greet", input: "hello" },
      { from: "Greet", to: "Menu", input: "options" },
      { from: "Greet", to: "Agent", input: "help" },
      { from: "Menu", to: "Agent", input: "help" },
      { from: "Menu", to: "End", input: "bye" },
      { from: "Agent", to: "End", input: "bye" },
      { from: "Start", to: "End", input: "bye" }
    ],
    mooreOutputs: {
      "Start": "Idle",
      "Greet": "Hello! How can I help?",
      "Menu": "1. Sales 2. Support",
      "Agent": "Connecting...",
      "End": "Goodbye!"
    },
    mealyOutputs: {
      "Start": { "hello": "Send Greeting", "bye": "Close Chat" },
      "Greet": { "options": "Show Menu", "help": "Route to Human" },
      "Menu": { "help": "Route to Human", "bye": "Close Chat" },
      "Agent": { "bye": "Close Chat" }
    },
    defaultSequence: ["hello", "options", "help", "bye"]
  }
};
