import React, { Fragment, useContext, useEffect,useReducer, useState } from "react";
import {Collapse} from 'react-bootstrap';
import { Modal } from "react-bootstrap";
/// Link
import { Link } from "react-router-dom";
import { getFilteredMenu } from "./Menu";
import foodServing from "../../../assets/images/food-serving.png";
import {useScrollPosition} from "@n8tb1t/use-scroll-position";
import { getByEmail } from "../../components/Dashboard/superAdminApi";



const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active : "",
  activeSubmenu : "",
}

const SideBar = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
      const fetchUser = async () => {
        const storedUser = JSON.parse(localStorage.getItem("userDetails"));
        if (storedUser?.email) {
          try {
            const response = await getByEmail(storedUser.email);
            const data = response.data; // axios renvoie les données dans data
            setUser(data);

          } catch (error) {
            console.error("Erreur de récupération :", error);
          }
        }
      };
      fetchUser();
    }, []);

  const filteredMenu = getFilteredMenu(user.role);

	var d = new Date();
  const [addMenus, setAddMenus] = useState(false);
  const [state, setState] = useReducer(reducer, initialState);	
  let handleheartBlast = document.querySelector('.heart');
  function heartBlast(){
    return handleheartBlast.classList.toggle("heart-blast");
  }


  
 	const [hideOnScroll, setHideOnScroll] = useState(true)
	useScrollPosition(
		({ prevPos, currPos }) => {
		  const isShow = currPos.y > prevPos.y
		  if (isShow !== hideOnScroll) setHideOnScroll(isShow)
		},
		[hideOnScroll]
	)

 
	const handleMenuActive = status => {		
		setState({active : status});			
		if(state.active === status){				
			setState({active : ""});
		}   
	}
	const handleSubmenuActive = (status) => {		
		setState({activeSubmenu : status})
		if(state.activeSubmenu === status){
			setState({activeSubmenu : ""})			
		}    
	}
 

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  useEffect(() => {
    filteredMenu.forEach((data) => {
      data.content?.forEach((item) => {
        if (path === item.to) {
          setState({ active: data.title })
        }
        item.content?.forEach(ele => {
          if (path === ele.to) {
            setState({ activeSubmenu: item.title, active: data.title })
          }
        })
      })
    })
  }, [path]);

  return (
    <div className="deznav">
      <div className="deznav-scroll dz-scroll">
          <ul className="metismenu" id="menu">              
            {filteredMenu.map((data, index)=>{
              let menuClass = data.classsChange;
                if(menuClass === "menu-title"){
                  return(
                      <li className={menuClass}  key={index} >{data.title}</li>
                  )
                }else{
                  return(				
                    <li className={` ${ state.active === data.title ? 'mm-active' : ''} ${data.to === path ? 'mm-active' : ''}`}
                      key={index} 
                    >                        
                      {data.content && data.content.length > 0 ?
                      <Fragment>
                          <Link to={"#"} 
                            className="has-arrow"
                            onClick={() => {handleMenuActive(data.title)}}
                          >								
                              {data.iconStyle}{" "}
                              <span className="nav-text">{data.title}</span>
                          </Link>
                          <Collapse in={state.active === data.title ? true :false}>
                            <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                              {data.content && data.content.map((data,index) => {									
                                return(	
                                    <li key={index}
                                      className={`${ state.activeSubmenu === data.title ? "mm-active" : ""} ${data.to === path ? 'mm-active' : ''}`}                                    
                                    >
                                      {data.content && data.content.length > 0 ?
                                          <>
                                            <Link to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                              onClick={() => { handleSubmenuActive(data.title)}}
                                            >
                                              {data.title}
                                            </Link>
                                            <Collapse in={state.activeSubmenu === data.title ? true :false}>
                                                <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                  {data.content && data.content.map((data,index) => {
                                                    return(	
                                                      <Fragment key={index}>
                                                        <li>
                                                          <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                                        </li>
                                                      </Fragment>
                                                    )
                                                  })}
                                                </ul>
                                            </Collapse>
                                          </>
                                        :
                                        <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
                                          {data.title}
                                        </Link>
                                      }
                                      
                                    </li>
                                  
                                )
                              })}
                            </ul>
                          </Collapse>

                      </Fragment>
                      :
                        <Link  to={data.to} >
                            {data.iconStyle}
                            <span className="nav-text">{data.title}</span>
                        </Link>
                      }
                      
                    </li>	
                  )
              }
            })}          
          </ul>	


          <div className="copyright">
            <p>
              <strong>TheMenuFy Restaurant Admin Dashboard</strong> © {d.getFullYear()} All Rights Reserved
            </p>
            <p>
              Made with{" "}
              <span className="heart" onClick={()=>heartBlast()}></span>{" "}by DexignZone
            </p>
          </div>
      </div>
    </div>
  );
}

export default SideBar;
