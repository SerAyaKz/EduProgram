import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";


const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const faqs = [
    {
      question: "What is the DDEduP platform?",
      answer: "DDEduP is a web-based platform that guides users through a structured 16-step workflow for educational program development. It combines AI-assisted recommendations with user input to create comprehensive educational programs aligned with labor market needs."
    },
    {
      question: "How does the program conceptualization work?",
      answer: "Users begin by inputting a program title. Our fine-tuned model then analyzes this input and generates suggested program goals based on patterns identified in our extensive training dataset of 8,269 educational programs. Users can review and refine these AI-generated goals to ensure alignment with specific institutional requirements."
    },
    {
      question: "How does labor market analysis work in the platform?",
      answer: "The system conducts automated labor market analysis by connecting educational programs to current employment needs. It draws data from HeadHunter and Enbek.kz platforms, providing comprehensive insights into the Kazakhstan job market. Users can also enter or generate Atlas professions for their educational program."
    },
    {
      question: "What is the Atlas of New Professions?",
      answer: "The Atlas of New Professions and Competencies is a collection of professions that, according to industry experts, are already in demand or will appear in the near future (5-10 years). Our platform integrates this data to help ensure the practical relevance of educational outcomes."
    },
    {
      question: "How does the skill extraction component work?",
      answer: "Our skill extraction component identifies and presents relevant competencies associated with selected professional positions. Users can then rank these skills based on importance and relevance to program objectives through our prioritization interface."
    },
    {
      question: "How are courses recommended?",
      answer: "Our system translates prioritized skills into structured learning experiences. The fine-tuned model generates specific learning outcomes for each recommended course, organized according to Bloom's taxonomy. Users can review these recommendations, select and customize courses to create coherent educational programs."
    },
    {
      question: "What languages does the platform support?",
      answer: "DDEduP supports content creation in multiple languages, including Kazakh, Russian, and English. This enhances the system's applicability in Kazakhstan's multilingual educational environment."
    },
    {
      question: "Can I create or modify professional standards?",
      answer: "Yes, the Standards Management interface allows users to create and modify professional standards with multilingual support."
    },
    {
      question: "How can I customize program learning outcomes?",
      answer: "The learning outcomes management component offers tools for customizing program outcomes, with options for both manual entry and automatic generation through our language model."
    },
    {
      question: "How does the recommendation system work?",
      answer: "The Recommendation component enables administrators to manage program AI or user-based recommendations through a user-friendly dialog system with immediate feedback notifications."
    }
  ];

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />
      
      <Box
        m="40px 0 0 0"
        sx={{
          "& .MuiAccordion-root": {
            backgroundColor: colors.primary[400],
            borderRadius: "4px",
            marginBottom: "10px",
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
          },
          "& .MuiAccordionSummary-root": {
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: colors.primary[300],
            },
          },
          "& .MuiAccordionSummary-content": {
            margin: "8px 0",
          },
          "& .MuiAccordionDetails-root": {
            padding: "8px 16px 16px",
            borderTop: `1px solid ${colors.grey[300]}`,
          },
        }}
      >
        {faqs.map((faq, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ;