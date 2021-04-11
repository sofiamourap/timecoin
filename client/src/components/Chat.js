import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import api from "../data/index.js";

export default function Chat() {
  const auth = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [service, setService] = useState({
    servicename: "",
    description: "",
    User: {},
  });
  const [request, setRequest] = useState({ serviceDate: "" });
  const [user, setUser] = useState();

  let { id } = useParams();
  let serviceId = request.serviceId;

  useEffect(() => {
    async function getProfile() {
      try {
        const result = await api.getProfile();
        setUser(result.data.id);
      } catch (err) {
        console.log(err);
      }
    }
    getProfile();
  }, []);

  useEffect(() => {
    async function getRequest() {
      try {
        const result = await axios.get(`/requests/info/${id}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
        setRequest(result.data);
        // console.log("this is result.data.Service.id", result.data.Service.id);
        getService(result.data.Service.id);
      } catch (err) {
        console.log(err);
      }
    }
    getRequest();
  }, []);

  async function getService(id) {
    try {
      const result = await api.getService(id);

      setService(result.data);
      console.log("this is service", service);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setMessages([]);
    Pusher.logToConsole = true;
    var pusher = new Pusher("f656e2c483a6ebf79c8c", {
      cluster: "eu",
      forceTLS: true,
      authEndpoint: "/requests/pusher/auth",
      auth: {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      },
    });

    //private channels MUST start with private-
    const channel_name = `private-timecoinChat-${id}`;
    var channel = pusher.subscribe(channel_name);
    channel.bind("message", function (data) {
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      pusher.unsubscribe(channel_name);
    };
  }, [id]);

  const sendMessage = async () => {
    const response = await axios.post(
      `/requests/${id}/messages`,
      {
        data: { message: input },
      },
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    setInput("");
    return response;
  };

  useEffect(() => {
    const getMessages = async () => {
      let { data } = await axios.get(`/requests/${id}/messages`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      setMessages((messages) => [...messages, ...data]);
      // console.log(result.data);
    };

    getMessages();
  }, []);

  return (
    // <div className="d-flex flex-column ">
    <div className="bg-white shadow rounded overflow-hidden">
      <h2 className="p-3 header-service-name"> Request Details</h2>
      <div className="chat-container">
        {/* 
        <div className="container service-container mb-5"> */}
        {/* <div className="row"> */}
        <div className="messaging">
          <div className="inbox_msg">
            {/* <div className="col-9 px-0 border-left"> */}
            {/* <div className="col-lg-3 col-md-4 ads back-container-service">
              <h1 className="">
                <span id="fl">Request</span>
                <span id="sl" className="text-center">
                  {service.servicename}
                </span>
              </h1>
              <div className="input-group mb-3">
                <h5>Day: {request.serviceDate}</h5>
              </div>
              <div className="input-group mb-3">
                <h5>Time: {request.serviceTime}</h5>
              </div>
              <div className="input-group mb-3">
                <h5>For how long? {request.amount} hour</h5>
              </div>
            </div> */}
            <div className="inbox_people">
              <div className="inbox_chat">
                <div className="chat_list active_chat">
                  <div className="chat_people">
                    <div class="chat_ib">
                      <h5>test {service.servicename}</h5>
                      <p>
                        Test, which is a new approach to have all solutions
                        astrology under one roof.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mesgs">
                <div className="msg_history">
                  <div className="incoming_msg">
                    <div className="incoming_msg_img">
                      {" "}
                      <img
                        src="https://ptetutorials.com/images/user-profile.png"
                        alt="sunil"
                        className="chat-image"
                      />{" "}
                    </div>
                    <div className="received_msg">
                      <div className="received_withd_msg">
                        <p>
                          Test which is a new approach to have all solutions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="outgoing_msg">
                    <div className="incoming_msg_img">
                      {" "}
                      <img
                        src="https://ptetutorials.com/images/user-profile.png"
                        alt="sunil"
                        className="chat-image"
                      />{" "}
                    </div>
                    <div className="sent_msg">
                      <p>Test which is a new approach to have all solutions</p>
                    </div>
                  </div>
                </div>
                <div className="type_msg">
                  <div className="input_msg_write">
                    <input
                      type="text"
                      className="write_msg"
                      placeholder="Type a message"
                    />
                    <button className="msg_send_btn" type="button">
                      <i className="far fa-paper-plane"></i>
                      {/* <i classNamess="far fa-paper-plane" aria-hidden="true"></i> */}
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="flex-grow-1 p-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.SenderId == user
                        ? "text-right my-2"
                        : "text-left my-2"
                    }
                  >
                    <div className="">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          message.SenderId == user
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        {message.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div> */}
              {/* <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-primary"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
