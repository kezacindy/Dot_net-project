<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SignUp.aspx.cs"
Inherits="E_Commerce_First.SignUp" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <title>Sign Up</title>
    <script
      src="http://code.jquery.com/jquery-3.5.1.js"
      integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
      crossorigin="anonymous"
    ></script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE-edge" />
    <link href="css/Custome.css" rel="stylesheet" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
    />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  </head>
  <body>
    <form id="form1" runat="server">
      <div>
        <div class="navbar navbar-default navbar-fixed-top" role="navigation">
          <div class="container">
            <div class="navbar-header">
              <button
                type="button"
                class="navbar-toggler"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <span class="sr-only">Toggle Navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="Default.aspx">
                <span>
                  <img
                    src="icons/safeIcons.png"
                    alt="BurikantuShop"
                    height="40"
                /></span>
                Burikantu Shop</a
              >
            </div>
            <div class="navbar-collapse collapse">
              <ul class="nav navbar-nav navbar-right">
                <li class="active"><a href="Default.aspx">Home</a></li>
                <li><a href="About.aspx">About</a></li>
                <%--
                <li><a href="#">Contact US</a></li>
                --%> <%--
                <li><a href="#">Blog-</a></li>
                --%>
                <li class="drodown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown"
                    >Products<b class="caret"></b
                  ></a>
                  <ul class="dropdown-menu">
                    <li><a href="Products.aspx">All Products</a></li>
                    <li role="separator" class="divider"></li>
                    <li class="dropdown-header">Men</li>
                    <li role="separator" class="divider"></li>
                    <li><a href="ManShirt.aspx">Shirts</a></li>
                    <li><a href="ManPants.aspx">Pants</a></li>
                    <li><a href="ManDenims.aspx">Denims</a></li>
                    <li role="separator" class="divider"></li>
                    <li class="dropdown-header">Women</li>
                    <li role="separator" class="divider"></li>
                    <li><a href="WomanTop.aspx">Top</a></li>
                    <li><a href="womanLegging.aspx">Leggings</a></li>
                    <li><a href="WomanSarees.aspx">Saree</a></li>
                  </ul>
                </li>
                <li><a href="SignUp.aspx">Registration</a></li>
                <%--
                <li>
                  <button
                    id="btnCart"
                    class="btn btn-primary navbar-btn"
                    type="button"
                  >
                    Cart <span class="badge" id="pCount" runat="server"></span>
                  </button>
                </li>
                <li id="btnSignUP" runat="server">
                  <a href="SignUp.aspx">SignUp</a>
                </li>
                <li id="btnSignIN" runat="server">
                  <a href="SignIn.aspx">SignIn</a>
                </li>
                <li>
                  <asp:Button
                    ID="btnlogout"
                    CssClass="btn btn-default navbar-btn "
                    runat="server"
                    Text="Sign Out"
                    OnClick="btnlogout_Click"
                  />
                </li>
                --%>
              </ul>
            </div>
          </div>
        </div>
        <%-- end of navbar --%>
      </div>

      <%-- start sign-up --%>

      <div class="center-page">
        <label class="col-xs-11">UserName:</label>
        <div class="col-xs-11">
          <asp:TextBox
            ID="txtUname"
            runat="server"
            Class="form-control"
            placeholder="Enter Your UserName"
          ></asp:TextBox>
        </div>

        <label class="col-xs-11">Password:</label>
        <div class="col-xs-11">
          <asp:TextBox
            ID="txtPass"
            runat="server"
            TextMode="Password"
            Class="form-control"
            placeholder="Enter Your password"
          ></asp:TextBox>
        </div>

        <label class="col-xs-11">Confirm Password:</label>
        <div class="col-xs-11">
          <asp:TextBox
            ID="txtCPass"
            runat="server"
            TextMode="Password"
            Class="form-control"
            placeholder="Enter Your Confirm password"
          ></asp:TextBox>
        </div>

        <label class="col-xs-11">Your Full Name:</label>
        <div class="col-xs-11">
          <asp:TextBox
            ID="txtName"
            runat="server"
            Class="form-control"
            placeholder="Enter Your Name"
          ></asp:TextBox>
        </div>

        <label class="col-xs-11">Email:</label>
        <div class="col-xs-11">
          <asp:TextBox
            ID="txtEmail"
            runat="server"
            Class="form-control"
            placeholder="Enter Your Email"
          ></asp:TextBox>
        </div>
        <label class="col-xs-11"></label>

        <div class="col-xs-11">
          <asp:Button
            ID="txtsignup"
            Class="btn btn-success"
            runat="server"
            Text="SignUp"
            OnClick="txtsignup_Click"
          />
          <%-- &nbsp;<asp:Label
            ID="lblMsg"
            runat="server"
            Text="Label"
          ></asp:Label>
          --%>
          <asp:Label
            ID="lblMsg"
            runat="server"
            Text="Hi, fill your info!"
          ></asp:Label>
        </div>
      </div>

      <%-- End sign-up --%>

      <!---Footer COntents Start here---->
      <hr />

      <footer class="footer-pos">
        <div class="container">
          <p class="pull-right">
            <a href="#">&nbsp; &nbsp; Back to top &nbsp; &nbsp;</a>
          </p>
          <p class="pull-right"><a href="AdminHome.aspx"> Admin Login </a></p>
          <p>
            &copy;2020 Coderbaba.in &middot;
            <a href="Default.aspx">Home</a>&middot;<a href="#">About</a
            >&middot;<a href="#">Contact</a>&middot;<a href="#">Products</a>
          </p>
        </div>
      </footer>

      <!---Footer COntents End---->
    </form>
  </body>
</html>
