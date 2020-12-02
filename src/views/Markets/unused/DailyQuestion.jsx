import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import checkedIcon from '../../assets/img/checked.png'
import uncheckedIcon from '../../assets/img/unchecked.png'

import Cookie from 'universal-cookie'
import './swal.css'


function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

function getServerURI() {
	if (window.location.hostname === 'localhost') {
		return 'http://localhost:5000'
	}
	return 'https://yieldwars-api.herokuapp.com'
}

let cookie = new Cookie()

const Question = ({ question, setResponse, voted }) => {
	const [checked, setChecked] = useState(cookie.get(question._id))

	const pick = (g) => {
		if (voted) {
			return;
		}
		cookie.set(question._id, g);
		setChecked(g);
		setResponse(g)
	}

	let questionOptions = [];
	question.options.forEach((option) => {
		questionOptions.push(
			<StyledContent>
				<StyledTitle>{option.name}</StyledTitle>
				{checked === option.name ? (
					<ButtonContainer onClick={() => pick(option.name)}>
						<img src={checkedIcon} width="30px" />
					</ButtonContainer>
				) : (
						<ButtonContainer onClick={() => pick(option.name)}>
							<img src={uncheckedIcon} width="30px" />
						</ButtonContainer>
					)}
			</StyledContent>
		)
	})

	return (
		<VersusCard>

			<RecDesc>
				Community question
      </RecDesc>
			<RecTitle>{question.description}</RecTitle>
			{(question.link && question.link.text) &&

				<a href={question.link.url} target="_blank" style={{ textDecoration: "none" }}>
					<RecDesc>
						{question.link.text} »
      </RecDesc>
				</a>
			}
			{questionOptions}
		</VersusCard>

	)
}

const RecDesc = styled.div`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
	color: #ffffff;
`;

const RecTitle = styled.div`
font-family: "Gilroy";
margin: 20px 0 20px 0;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.24;
  letter-spacing: normal;
  text-align: center;
	color: #ffffff;
`;


const ButtonContainer = styled.div`
`


const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
	justify-content: space-between;
	margin: auto;
	margin-top: 20px;
	width: 80%;
`

const StyledTitle = styled.h4`
margin: 0;
font-family: "Gilroy";
font-size: 25px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: center;
color: #ffffff;
  padding: 0;
`

const VersusCard = !isMobile() ? styled.div`
width: 480px;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 30px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
	margin-bottom: 40px;
` : styled.div`
width: calc(90vw - 60px);
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 30px;
  border-radius: 8px;
    border: solid 2px rgba(255, 183, 0, 0.3);
	background-color: rgba(256,256,256,0.08);
	margin-bottom: 40px;
`


export default Question