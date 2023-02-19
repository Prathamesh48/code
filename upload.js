
"use strict";
import React, { useState, useRef } from "react";
import { BiCloud, BiMusic, BiImageAdd, BiVideo } from "react-icons/bi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import saveToIPFS from "@/ipfs";
import { useCreateAsset } from '@livepeer/react'
import getContract from "@/contractAbi";

export default function Upload() {


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [video, setVideo] = useState("");
  const resetInputField = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setThumbnail("");
    setVideo("");
  };

  const thumbnailRef = useRef();
  const videoRef = useRef();

  const {
    mutate: createAsset,
    data: asset
  } = useCreateAsset({
    sources: [{ name: video.name, file: video }]
  });
  

  const handleSubmit = async () => {
    await uploadVideo();
    const thumbnailCID = await uploadThumbnail();

    let data = {
      video: asset?.id,
      title,
      description,
      location,
      category,
      thumbnail: thumbnailCID,
      UploadedDate: Date.now(),
    };
    await saveVideo(data);
  };


  const uploadThumbnail = async () => {
    const cid = await saveToIPFS(thumbnail);
    return cid;
  };


  const uploadVideo = async () => {
    createAsset?.();
  };


  const saveVideo = async (data) => {
    let contract = await getContract();
    await contract.uploadVideo(
      data.video,
      data.title,
      data.description,
      data.location,
      data.category,
      data.thumbnail,
      
      data.UploadedDate
    );
  };


    return (
      <>
        <div className="flex justify-end">
          <ConnectButton />
        </div>
        <div className="justify-center h-screen flex  flex-row">
          <div className="flex-1 flex flex-col">
            {/* Inputs */}
            <div className="flex flex-col m-10 mt-5 lg:flex-row">
              <div className="flex lg:w-3/4 flex-col">
                {/* <label className="text-[#9CA#AF] text-sm">
                  Title
              </label> */}
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add Title"
                  className="w-[85%] text-black-500 placeholder::text-grey-600 rounded-md mt-2 h-12 p-2
                 border border-pink-700 border-dashed bg-transparent focus:outline-none"
                />
                {/* <label className="text-[#9CA3AF] mt-10">Description</label> */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Your Description Here"
                  className="w-[85%] text-black-500 h-32 placeholder::text-gray-600 rounded-md mt-2 p-2 
                 border border-pink-700  border-dashed bg-transparent focus:outline-none"
                ></textarea>


                <div className="flex flex-row mt-2 w-[85%] justify-between">
                  <div className="flex flex-col w-2/5">
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      type="text"
                      placeholder="India"
                      className="w-[100%] text-black-500 placeholder::text-gray-600 rounded-md mt-2 p-2 
                    border border-pink-700 border-dashed bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col w-2/5">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-[100%] text-black placeholder::text-gray-600 rounded-md mt-2 p-2 
                    border-dashed border border-pink-700 bg-transparent focus:outline-none"

                    >
                      <option>Finance</option>
                      <option>Vlog</option>
                      <option>Gaming</option>
                      <option>Technology</option>
                      <option>Music & Entertainment</option>
                      <option>Other</option>
                    </select>
                  </div>

                </div>
                <div className="flex flex-row gap-10 ">
                  <div
                    onClick={() => {
                      thumbnailRef.current.click();
                    }}
                    className="border w-64 border-pink-600 border-dashed rounded-md mt-2 p-2 h-full items-center justify-center flex"
                  >
                    {/* border-2 w-64 border-gray-600  border-dashed rounded-md mt-2 p-2  h-36 items-center justify-center flex */}
                    {thumbnail ? (
                      <picture>
                        <img onClick={() => {
                          thumbnailRef.current.click();
                        }} src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="h-full rounded-md" />
                      </picture>
                  
                    ) : (
                      
                      <p><BiImageAdd size={30} color="gray" /></p>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      ref={thumbnailRef}
                      onChange={(e) => {
                        setThumbnail(e.target.files[0]);
                      }}
                    />
                
                  </div>
                
                  <div
                    onClick={() => {
                      videoRef.current.click();

                    }}
                    className={
                      video ? "border w-64 border-pink-600 border-dashed rounded-md mt-2 p-2 h-full items-center justify-center flex"
                        : "border w-64 border-pink-600 border-dashed rounded-md mt-2 p-2 h-full items-center justify-center flex"
                    }
                  >
                    {video ? (
                      <video
                        controls
                        src={URL.createObjectURL(video)}
                        className="h-full rounded-md"
                      />
                    ) : (
                      <BiVideo size={30} color="gray" />
                    )}

                  </div>
                </div>
                <input type="file" accept="video/*" className="hidden" ref={videoRef} onChange={(e) => {
                  setVideo(e.target.files[0]);
                  console.log(e.target.files[0]);
                }} />
              </div>
            </div>
              
          

            {/* Button Div starts */}
            <div className="  flex justify-center ">
              <div className="flex items-center">
                <button type="reset" onClick={resetInputField} className="bg-transaparent py-2 px-6 border rounded-lg border-gray-600 mr-6">
                  Discard
                </button>
                <button onClick={() => {
                  handleSubmit();
                }}
                  className="bg-pink-700 hover:bg-pink-500 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
                >
                  <BiCloud />
                  <p className="ml-2">Upload</p>

                </button>

              </div>
            </div>
            {/* Button div Ends */}
          </div>
        
        </div>
  
      </>
    );
  }

