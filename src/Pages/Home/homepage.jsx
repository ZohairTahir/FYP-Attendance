import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/headerSup";
import {
  ThemeProvider,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  createTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardBody from '@mui/material/CardContent';
import CardFooter from '@mui/material/CardActions';
import ZOHAIR from '../assets/zohair.jpg'; // Replace with the correct path to the image

const theme = createTheme({
  palette: {
    primary: {
      main: '#007FFF',
      dark: '#0066CC',
    },
  },
});

export default function Home() {
  const [groupCards, setGroupCards] = useState([]);
  const [userIdFromCookie, setUserIdFromCookie] = useState("");
  const [userEmailFromCookie, setUserEmailFromCookie] = useState("");

  useEffect(() => {
    const fetchGroupCards = async () => {
      try {
        const userIdFromCookie = Cookies.get("userId");
        const userEmailFromCookie = Cookies.get("email");
        setUserIdFromCookie(userIdFromCookie);
        setUserEmailFromCookie(userEmailFromCookie);

        const response = await axios.get(
          `http://localhost:5001/grpcrd/author/${userIdFromCookie}/${userEmailFromCookie}`,
        );
        console.log("Homepage Response data:", response.data);
        const groupCards = response.data.cards;
        setGroupCards(groupCards);

      
      } catch (error) {
        console.error("Error fetching group cards:", error.message);
      }
    };

    fetchGroupCards();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-full">
        <Header />

        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Typography variant="h4" component="h1" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            Groups 
            <Chip                
                    label={
                          <Typography
                            variant="small"
                            color="textPrimary"
                            className="px-6 font-large capitalize leading-none"
                            style={{ fontSize: '18px', fontWeight: 'bold' }}
                          >
                            {groupCards.length}
                          </Typography>
                        }
                        className="rounded-full py-1.4"
                        style={{ marginBottom: '1px',}} // Adjust for spacing between chips
                      />
            
          </Typography>
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap', // Allows the cards to wrap onto the next line if the screen is too narrow
              gap: '16px', // Adds space between the cards
              justifyContent: 'center', // Centers the cards horizontally
            }}
          >
            {groupCards.map((card) => (
              <Card className="mt-6 w-96" key={card._id}>
                <CardBody>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {card.projectTitle}
                  </Typography>
                  <Typography>
                    Supervisor: {card.supervisor}
                  </Typography>
                  <div className="mt-4">
                    {card.groupMembers.map((name, index) => (
                      <Chip
                        key={index}
                        // icon={
                        //   <Avatar
                        //     size="xs"
                        //     variant="circular"
                        //     className="h-mid w-mid -translate-x-0.2"
                        //     alt={name}
                        //     src={ZOHAIR} // Replace with dynamic data or a default avatar
                        //   />
                        // }
                        label={
                          <Typography
                            variant="small"
                            color="textPrimary"
                            className="px-7 font-medium capitalize leading-none"
                          >
                            {name}
                          </Typography>
                        }
                        className="rounded-full py-1.5"
                        style={{ marginBottom: '8px' }} // Adjust for spacing between chips
                      />
                    ))}
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                <Link to={`/group/${card._id}`}>
                    <button type="button" className="btn btn-primary" style={{ backgroundColor: 'blue', color: 'white' }}>
                      View Details
                    </button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
