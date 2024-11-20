import { Toaster,toast } from 'react-hot-toast';

import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useDisclosure,
} from "@nextui-org/react";
import im from "../../assets/profile.webp"
import { FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, loadUser, updateProfile, updateProfileReset } from "../../slices/userSlice";

export default function Update() {
    const { loading, error, isUpdated,user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNo, setPhone] = useState(user?.phoneNo);
  const [avatar, setAvatar] = useState(""); // Store the image file
  const [avatarPreview, setAvatarPreview] = useState(im); // Preview URL  
    useEffect(() => {
      if (!user) {
        dispatch(loadUser());
      }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
          setName(user?.name);
          setEmail(user?.email);
          setPhone(user?.phoneNo);
          setAvatarPreview(user?.avatar.url);
        }
    
        if(error){
            // alert(error);
            toast.error(error);
            dispatch(clearErrors());
          }
        if(isUpdated){
            toast.success("Profile Updated");
            dispatch(loadUser());
            navigate("/my");
            dispatch(updateProfileReset())

        }

      }, [dispatch, error, alert, navigate, user,isUpdated]);


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState("md");
  // Form state variables
  
 

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
    const reader=new FileReader();
    reader.onload=()=>{
      if(reader.readyState===2){
        setAvatar(reader.result);
      }
    }
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    const myForm=new FormData();
    myForm.set("name",name);
    myForm.set("email",email);
    myForm.set("avatar",avatar);
    myForm.set("phoneNo",phoneNo);
    dispatch(updateProfile(myForm));
    };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => handleOpen("4xl")}>
          <FaPen className="-ml-2 pl-3" />
        </button>
      </div>
      <Modal size={size} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Update Information</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone Number"
                    value={phoneNo}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Avatar
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    />
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="mt-3 rounded-lg w-24 h-24 object-cover"
                      />
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
