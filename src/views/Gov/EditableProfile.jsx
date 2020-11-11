import React, { useCallback, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import axios from "axios";
import swal from "sweetalert2";
import useYam from '../../hooks/useYam'
import editIcon from "../../assets/img/edit@2x.png"
import { GithubPicker } from "react-color";
import Picker from 'emoji-picker-react';


function getServerURI() {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://yieldwars-api.herokuapp.com";
}

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    [ref, handler]
  );
}

const Profile = ({ nickname, picture, color }) => {
  const { account, connect } = useWallet()
  const [editing, setEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [newPicture, setNewPicture] = useState(picture);
  const [editingPicture, setEditingPicture] = useState(false);
  const [editingColor, setEditingColor] = useState(false);
  const [newColor, setNewColor] = useState(color);
  const yam = useYam()
  const colorRef = useRef()
  const pictureRef = useRef()
  useOnClickOutside(colorRef, () => setEditingColor(false));
  useOnClickOutside(pictureRef, () => setEditingPicture(false));

  const submitEdits = () => {
    axios.post(`${getServerURI()}/gov/update-account`, {
      address: account,
      picture: newPicture,
      pictureColor: newColor,
      nickname: newNickname,
    }).then(res => {
      swal.fire("successfully updated account");
      setEditing(false);
    }).catch(err => {
      console.log(err);
    })
  }

  const cancelEdits = () => {
    setNewNickname(nickname);
    setNewPicture(picture);
    setNewColor(color);
    setEditingPicture(false);
    setEditingColor(false);
    setEditing(false);
  }

  const handleChange = (e) => {
    setNewNickname(e.target.value);
  }

  const PictureEditor = () => {
    const onEmojiClick = (e, emojiObject) => {
      setNewPicture(emojiObject.emoji);
    }
    return (
      <PictureEditModal ref={pictureRef}>
        <Picker disableAutoFocus={true} groupNames={{ smileys_people: "PEOPLE" }} onEmojiClick={onEmojiClick} />
      </PictureEditModal>
    )
  }

  const ColorEditor = () => {
    const setPickerColor = (pickerColor) => {
      console.log("color", pickerColor)
      setNewColor(pickerColor.hex);
    }
    return (
      <ColorEditModal ref={colorRef}>
        <GithubPicker color={newColor} onChangeComplete={setPickerColor} />
      </ColorEditModal>
    )
  }

  if (editing) {
    return (
      <>
        <EditingButtons>
          <XButton onClick={() => cancelEdits()}>
            ✘
          </XButton>
          <CheckButton onClick={() => submitEdits()}>
            ✔
          </CheckButton>
        </EditingButtons>
        <EditTop>
          <ColorContainer>
            <ColorEditButton onClick={() => setEditingColor(true)} style={{ backgroundColor: newColor }} >
              {editingColor && <ColorEditor />}
            </ColorEditButton>
          </ColorContainer>
          <EditProfilePicContainer style={{ backgroundColor: newColor }} onClick={() => setEditingPicture(true)}>
            {newPicture}
            {editingPicture && <PictureEditor />}
          </EditProfilePicContainer>
          <ColorContainer />

        </EditTop>
        <EditNickName placeholder={nickname ? nickname : account} onChange={(e) => handleChange(e)} value={newNickname} />
      </>
    )
  }

  return (
    <>
      <EditButton src={editIcon} onClick={() => setEditing(true)} />
      <ProfilePicContainer style={{ backgroundColor: newColor }}>
        {newPicture}
      </ProfilePicContainer>
      <Nickname>
        {newNickname ? newNickname : account.substring(0, 20) + "..."}
      </Nickname>
    </>
  )
}

const ColorEditButton = styled.div`
width: 25px;
height: 25px;
border-radius: 50%;
border: 2px solid white;
cursor: pointer;`

const EditTop = styled.div`
display: flex;
justify-content: space-evenly;
width: 100%;
margin-bottom: 20px;
`

const ColorContainer = styled.div`
width: 100px;
display: flex;
align-items: center;
justify-content: center;`

const PictureEditModal = styled.div`
display: flex;
flex-direction: column;
position: absolute;
top: 120px;`

const ColorEditModal = styled.div`
display: flex;
flex-direction: column;
position: absolute;
bottom: 340px;
left: 82px;`

const EditNickName = styled.input`
height: 30px;
width: 70%;
border: none;
background: none;
border-bottom: 1px dashed rgba(256,256,256,0.5);
font-size: 30px;
font-family: Alegreya;
color: white;
text-align: center;
&:focus {
  outline: none;
},
&:active {
  outline: none;
}
`

const Nickname = styled.div`
font-family: Alegreya;
font-size: 30px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
height: 30px;
width: 70%;
`

const EditProfilePicContainer = styled.div`
width: 82px;
height: 82px;
background-color: #002450;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 50px;
user-select: none;
border: solid 2px rgba(256,256,256,0.3);
&:hover {
  cursor: pointer;
}
`

const ProfilePicContainer = styled.div`
width: 82px;
height: 82px;
background-color: #002450;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 20px;
font-size: 50px;
user-select: none;
border: solid 2px rgba(256,256,256,0.3);
`

const CheckButton = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 20px;
font-size: 22px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: pointer;
transition: all .1s linear;
&:hover {
  font-size: 24px;
}`

const XButton = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 20px;
font-size: 18px;
display: flex;
align-items: center;
justify-content: center;
color: white;
cursor: pointer;
transition: all .1s linear;
&:hover {
  font-size: 20px;
}`

const EditingButtons = styled.div`
width: 46px;
height: 16px;
display: flex;
justify-content: space-between;
position: absolute;
right: 20px;
top: 20px;
`

const EditButton = styled.img`
position: absolute;
right: 20px;
top: 20px;
width: 16px;
height: 16px;
cursor: pointer;
transition: all .1s linear;
&:hover {
  width: 18px;
  height: 18px;
}`

export default Profile