"use client";
"use strict";
import axios from "axios";
import { scrollToBottom, initialMessages, getSources } from "@/lib/utils";
import { ChatLine } from "./chat-line";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useEffect, useRef, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";

export function Chat() {
  const containerRef = useRef(null);

  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (messages.length > 1 && isLoading) {
      callAPIChat();
    }
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages, isLoading]);
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([...messages, { role: "human", content: input }]);
    setIsLoading(true);
  };

  const callAPIChat = async () => {
    setIsLoading(true);
    const mes = input;
    if (!mes || !Array.isArray(mes)) {
      setIsLoading(true);
      setInput("");
      const res = await fetch("api/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          message: mes,
        }),
      });
      const text = await res.json();
      console.log("text.message", text.message);
      if (text) {
        setIsLoading(false);
        setMessages([
          ...messages,
          { role: "assistant", content: text.message },
        ]);
      }
    }

    
  };

  return (
    <div className=" bg-white rounded-2xl border h-[75vh] flex flex-col justify-between backdrop-filter backdrop-blur-sm md:backdrop-blur-l ">
      <h4 className="title-chat">Chat with với tôi nhé</h4>
      <div className="p-2 overflow-auto" ref={containerRef}>
        {messages.map((mes, index) => (
          <div key={index}>
            <ChatLine role={mes.role} content={mes.content} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex clear-both">
        <Input
          value={input}
          placeholder={"Type to chat with AI..."}
          onChange={handleInputChange}
          className="mr-2"
        />

        <Button type="submit" className="w-24">
          {isLoading ? <Spinner /> : "Ask"}
        </Button>
      </form>
    </div>
  );
}
