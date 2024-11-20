import React, { useState, useEffect } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from '@nextui-org/react';
import s from '../../assets/1119840-200.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../slices/userSlice';
import im from "../../assets/profile.webp"

const Header = () => {
  const dispatch=useDispatch();
  const location=useLocation();
  // console.log(location);
  const navigate=useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const isActive = (path) => location.pathname === path;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); // Navbar background changes on scroll
      } else {
        setIsScrolled(false); // Navbar background is transparent at the top
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const { loading, error, isAuthenticated,user } = useSelector((state) => state.user);
// console.log(user);
function out(){
  dispatch(logoutUser());
  navigate("/");
  }
  console.log(im)
  // console.log(user);
  const handleAddBusClick = () => {
    navigate('/addbus');
  };
  const handleManageBusClick=()=>{
    navigate('/managebus')
  }
  return (
    <Navbar
      isBordered
      className={`fixed flex items-center z-10 transition-all bg-transparent ${
       ( location.pathname === '/') 
          ?isScrolled?'text-black' : 'text-white'
            : 'text-black' 
      }
      `}
    >
      {/* //  ${location.pathname!=='/'&&"text-black"}` */}
      {/* Brand Section */}
      <NavbarBrand className="flex items-center gap-1 flex-grow-0">
        <Dropdown placement="bottom-start" className="sm:hidden">
          <DropdownTrigger>
            {/* Logo as Dropdown Trigger on Small Screens */}
            <img src={s} alt="logo" className="h-10 w-auto cursor-pointer" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Navigation Menu">
            <DropdownItem key="bus">
              <NavLink to="/bus">Bus</NavLink>
            </DropdownItem>
            <DropdownItem key="contactus">
              <NavLink to="/contactus">Contact Us</NavLink>
            </DropdownItem>
            <DropdownItem key="integrations">
              <NavLink to="/integrations">Integrations</NavLink>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Logo and Title Visible on Larger Screens */}
        <p className="font-bold text-lg w-[9rem] cursor-pointer" onClick={()=>navigate('/')}>RideVerse</p>
      </NavbarBrand>

      {/* Center content - hidden on small screens, shown on large screens */}
      <NavbarContent className="hidden sm:flex" justify="center">
      <NavbarItem isActive={isActive('/')}>
          <NavLink to="/" className="text-inherit" >
            Home
          </NavLink>
        </NavbarItem>
        <NavbarItem isActive={isActive('/bus')}>
          <NavLink to="/bus" className="text-inherit" >
            Bus
          </NavLink>
        </NavbarItem>
        <NavbarItem isActive={isActive('/contactus')} >
          <NavLink to="/aboutus" className="text-inherit">
            About Us
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      {/* Avatar dropdown on right */}
      {isAuthenticated ?<NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={user?.avatar.url==="https://example.com/duumy.jpg"?im:user?.avatar.url}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" >
            <DropdownItem key="profile" className="h-14 gap-2" onClick={()=>navigate('/my')}>
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            {
             user?.role==='travel'?( <DropdownItem onClick={handleAddBusClick}>
                Add Bus
  
              </DropdownItem>):(null)
            }
             {
             user?.role==='travel'?( <DropdownItem onClick={handleManageBusClick}>
                Manage Buses
  
              </DropdownItem>):(null)
            }
            {
              isAuthenticated?(  <DropdownItem key="mybookings"  onClick={()=>navigate('/mybookings')}>
                My Bookings
  
              </DropdownItem>):(null
              )
            }
            {
              isAuthenticated?(  <DropdownItem key="logout" color="danger" onClick={out}>
                Log Out
  
              </DropdownItem>):(null
              )
            }
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>:location.pathname !== '/login' ? <Button onClick={()=>{
        navigate('/login');
      }} className={`bg-[#ffffff] font-bold `}>
        Login/SignUp
      </Button>:<></> }
    
    </Navbar>
  );
};

export default Header;
