import {
  Box,
  IconButton,
  useTheme,
  Button,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  
  const dbUser = JSON.parse(localStorage.getItem('dbUser'));


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('dbUser');
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}

        {/* USER PROFILE */}
        <IconButton
          onClick={handleClick}
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {user ? (
            <Avatar
            src={(dbUser && dbUser?.photoUrl) || "../assets/user.png"}
            alt={ dbUser?.displayName}
            sx={{ width: 32, height: 32 }}
          />
          ) : (
            <PersonOutlinedIcon />
          )}
        </IconButton>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "user-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link
              to="/form"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Profile
            </Link>
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
