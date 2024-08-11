import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../components/headerSup";
//import Supervisordata from "../../../models/Supervisordata";
import { ThemeProvider, Box, Typography, createTheme, useRadioGroup } from '@mui/material';

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
  const[userEmailFromCookie,setUserEmailFromCookie] = useState("");
  useEffect(() => {
    const fetchGroupCards = async () => {
      try {
        const userIdFromCookie = Cookies.get("userId");
        const userEmailFromCookie = Cookies.get("email");
        console.log(userEmailFromCookie)
        setUserIdFromCookie(userIdFromCookie);
        setUserEmailFromCookie(userEmailFromCookie);
        const response = await axios.get(
          `http://localhost:5001/grpcrd/author/${userIdFromCookie}/${userEmailFromCookie}`,
        );
        const reversedCards = response.data.cards.reverse();
        setGroupCards(reversedCards);
        }
        
     catch (error) {
        console.error("Error fetching group cards:", error.message);
      }
    };
    fetchGroupCards();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-full">
        <Header />
        <header className="bg-[#DEE4EA] shadow">
          <div className="flex items-center justify-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              GROUPS
            </h1>
          </div>
        </header>

        <main className="bg-gray-100">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {groupCards.map((card) => (
              <Link to={`/group/${card._id}`} key={card._id}>
                <Box
                  sx={{
                    width: 300,
                    height: 200,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    m: 2,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {card.projectTitle}
                  </Typography>
                  <Typography variant="body2">
                    Applicants: {card.applicants.map(applicant => applicant.name).join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    Last Updated: {card.lastUpdated}
                  </Typography>
                </Box>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
