import Image from "next/image";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="scene">
        <div className="container container-position">
          <div className="chat-content">
            {/* <div className=" d-flex bg-transparent">
            <span className="font-bold">Chat-with-MobiFone 7</span>
          </div> */}
            <div className="flex flex-1">
              <div className="w-full">
                <Chat />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
