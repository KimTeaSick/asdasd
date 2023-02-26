import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import Group from "./pages/group/Group";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import Notice from "./pages/notice/Notice";
import NoticeList from "./pages/noticeList/NoticeList";
import Log from "./pages/log/Log";
import { useSelector, useDispatch } from "react-redux";
import { fetchHome } from "./slices/admission";
import { useCallback, useEffect, useState } from "react";
import NoticeDetail from "./pages/noticeDetail/NoticeDetail";
import APIs from "./lib/APIs";
import userSlice from "./slices/user";

function App() {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.user.isLoggedIn);
  const history = useHistory();
  // const isLoggedIn = localStorage.getItem("accessToken");

  const loginSubmit = useCallback(
    async (id, pw) => {
      const body = {
        email: id,
        password: pw,
      };
      await APIs.signIn(body)
        .then((res) => {
          console.log("res.userInfo", res.userInfo);
          console.log("body", body);
          dispatch(
            userSlice.actions.setUser({
              email: res.userInfo.EMAIL,
              name: res.userInfo.NAME,
              number: res.userInfo.NUMBER,
              password: res.userInfo.PASSWORD,
              userIdx: res.userInfo.USER_IDX,
              sortation: res.userInfo.SORTATION,
              token: res.token,
              isLoggedIn: true,
            })
          );
          localStorage.setItem("accessToken", res.token);
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
          alert("잠시후에 다시 시도해주세요");
        });
    },
    [dispatch, history]
  );

  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    if (loginStatus === "true") {
      const id = localStorage.getItem("id");
      const pw = localStorage.getItem("pw");
      loginSubmit(id, pw);
    }
    // if (login) dispatch(fetchHome());
  }, [login, history, loginSubmit]);

  return (
    <>
      <Router>
        {login ? (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/noticelist">
                  <NoticeList />
                </Route>
                <Route path="/noticeDetail/:noticeId">
                  <NoticeDetail />
                </Route>
                <Route path="/users">
                  <UserList />
                </Route>
                <Route path="/user/:userId">
                  <User />
                </Route>
                <Route path="/newUser">
                  <NewUser />
                </Route>
                <Route path="/group">
                  <Group />
                </Route>
                <Route path="/product/:productId">
                  <Product />
                </Route>
                <Route path="/notice">
                  <Notice />
                </Route>
                <Route path="/newproduct">
                  <NewProduct />
                </Route>
                <Route path="/log">
                  <Log />
                </Route>
              </Switch>
            </div>
          </>
        ) : (
          <Route>
            <Login />
          </Route>
        )}
      </Router>
    </>
  );
}

export default App;
