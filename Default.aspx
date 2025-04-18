﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="E_Commerce_First.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>BurikantuShop</title>
    <script src="http://code.jquery.com/jquery-3.5.1.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
    crossorigin="anonymous">   </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE-edge">
    <link href="css/Custome.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div class="navbar navbar-default navbar-fixed-top" role="navigation">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle Navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="Default.aspx"> <span> <img src="icons/safeIcons.png" alt="BurikantuShop" height="40" /></span> Burikantu Shop</a>
                    </div>
                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">
                            <li class="active"><a href="Default.aspx">Home</a> </li>
                            <li><a href="About.aspx">About</a> </li>
                            <%--<li><a href="#">Contact US</a> </li>--%>
                            <%--<li><a href="#">Blog-</a> </li>--%>
                            <li class="drodown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Products<b
                                class="caret"></b></a>
                                <ul class="dropdown-menu ">
                                    <li><a href="Products.aspx">All Products</a></li>
                                    <li role="separator" class="divider "></li>
                                    <li class="dropdown-header ">Men</li>
                                    <li role="separator" class="divider "></li>
                                    <li><a href="ManShirt.aspx">Shirts</a></li>
                                    <li><a href="ManPants.aspx">Pants</a></li>
                                    <li><a href="ManDenims.aspx">Denims</a></li>
                                    <li role="separator" class="divider "></li>
                                    <li class="dropdown-header ">Women</li>
                                    <li role="separator" class="divider "></li>
                                    <li><a href="WomanTop.aspx">Top</a></li>
                                    <li><a href="womanLegging.aspx">Leggings</a></li>
                                    <li><a href="WomanSarees.aspx">Saree</a></li>
                                </ul>
                            </li>
                            <li><a href="SignUp.aspx">SignUp</a> </li>
                            <%--
                            <li>
                                <button id="btnCart" class="btn btn-primary navbar-btn " type="button">
                                    Cart <span class="badge " id="pCount" runat="server"></span>
                                </button>
                            </li>
                            <li id="btnSignUP" runat="server"><a href="SignUp.aspx">SignUp</a> </li>
                            <li id="btnSignIN" runat="server"><a href="SignIn.aspx">SignIn</a> </li>
                            <li>
                                <asp:Button ID="btnlogout" CssClass="btn btn-default navbar-btn " runat="server"
                                    Text="Sign Out" OnClick="btnlogout_Click" />
                            </li>
                            --%>
                        </ul>
                    </div>
                </div>
            </div>

            <!---image slider---->
            <div class="container">
                 <h2>
                     Carousel Example</h2>
                 <div id="myCarousel" class="carousel slide" data-ride="carousel">
                    <!-- Indicators -->
                    <ol class="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                        <li data-target="#myCarousel" data-slide-to="1"></li>
                        <li data-target="#myCarousel" data-slide-to="2"></li>
                    </ol>

                    <!-- Wrapper for slides -->
                    <div class="carousel-inner">
                        <div class="item active">
                            <img src="ImgSlider/1.jpeg" alt="Los Angeles" style="width: 100%; height:251px;">
                                <div class="carousel-caption">
                                    <h3>
                                         Brand new Fashion</h3>
                                    <p>
                                         50% off</p>
                                    <p>
                                         <a class="btn btn-lg btn-primary" href="Products.aspx" role="button">Buy Now</a>

                                    </p>
                                </div>
                       </div>
                       
                       <div class="item">
                            <img src="ImgSlider/2.jpeg" alt="Chicago" style="width: 100%; height:251px;">
                            <div class="carousel-caption">
                                <h3>
                                    IPhone moble Shopping</h3>
                                <p>
                                    20% off</p>
                            </div>
                       </div>
                       
                       <div class="item">
                            <img src="ImgSlider/3.png" alt="New york" style="width: 100%; height:251px;">
                            <div class="carousel-caption">
                                <h3>
                                    On mobile you can get</h3>
                                <p>
                                    25% off</p>
                            </div>
                       </div>
                    </div>

                    <!-- Left and right controls -->
                    <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left"></span>
                        <span class="sr-only">Previous</span> 
                    </a>
                    <a class="right carousel-control" href="#myCarousel" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
            <!--- End image slider---->
            <hr/>

            <!---Middle COntents start---->
            <div class="container center ">
                <div class="row ">
                    <div class="col-lg-4">
                        <img class="img-circle " src="Mobile/iphone11.jpeg" alt="thumb" width="140" height="140" />
                        <h2>
                            Mobiles</h2>
                        <p>
                            Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                            design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                            that is water-resistant up to 2 meters for 30 minutes....</p>
                        <p>
                        <a class="btn btn-default " href="#" role="button">View More &raquo;</a></p>
                    </div>

                    <div class="col-lg-4">
                        <img class="img-circle " src="Images/Shoes.jpeg" alt="thumb" width="140" height="140" />
                        <h2>
                            Footwear</h2>
                        <p>
                            Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                            design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                            that is water-resistant up to 2 meters for 30 minutes....</p>
                        <p>
                        <a class="btn btn-default " href="#" role="button">View More &raquo;</a></p>
                    </div>

                    <div class="col-lg-4">
                        <img class="img-circle " src="Images/tshirt.jpeg" alt="thumb" width="140" height="140" />
                        <h2>
                            Clothings</h2>
                        <p>
                            Featuring a 15.49-cm (6.1) all-screen Liquid Retina LCD and a glass and aluminum
                            design, the iPhone 11 is as beautiful as it gets. Also, the IP68 rating ensures
                            that is water-resistant up to 2 meters for 30 minutes....</p>
                        <p>
                        <a class="btn btn-default " href="#" role="button">View More &raquo;</a></p>
                    </div>
                </div>
            <div class="panel panel-primary">
                <div class="panel-heading">
                    BLACK FRIDAY DEAL</div>
                <div class="panel-body">
                    <div class="row" style="padding-top: 50px">
                        <asp:Repeater ID="rptrProducts" runat="server">
                            <ItemTemplate>
                                <div class="col-sm-3 col-md-3">
                                    <a href="ProductView.aspx?PID=<%# Eval("PID") %>" style="text-decoration: none;">
                                        <div class="thumbnail">
                                            <img src="Images/ProductImages/<%# Eval("PID") %>/<%# Eval("ImageName") %><%# Eval("Extention") %>"
                                                alt="<%# Eval("ImageName") %>" />
                                           <div class="caption">
                                                <div class="probrand">
                                                    <%# Eval ("BrandName") %>
                                                </div>
                                                <div class="proName">
                                                    <%# Eval ("PName") %>
                                                </div>
                                                <div class="proPrice">
                                                    <span class="proOgPrice">
                                                        <%# Eval ("PPrice","{0:0,00}") %>
                                                    </span>
                                                    <%# Eval ("PSelPrice","{0:c}") %>
                                                    <span class="proPriceDiscount">(<%# Eval("DiscAmount","{0:0,00}") %>
                                                    off) </span>
                                                </div>
                                           </div>
                                        </div>
                                    </a>
                                </div>
                            </ItemTemplate>
                        </asp:Repeater>
                    </div>
                </div>

                <div class="panel-footer">
                     Buy 50 mobiles and get a gift card
                </div>
            </div>
        </div>
    
        <!---Middle COntents End---->
        </div>

        <!---Footer COntents Start here---->
        <hr />

        <footer>
            <div class ="container ">
           
                <p class ="pull-right "><a href ="#">&nbsp; &nbsp; Back to top &nbsp; &nbsp;</a></p>
                <p class ="pull-right "><a href="AdminHome.aspx"> Admin Login  </a></p>  
                <p>&copy;2025 Burikantu shop &middot; <a href ="Default.aspx">Home</a>&middot;<a href ="#">About</a>&middot;<a href ="#">Contact</a>&middot;<a href ="#">Products</a> </p>
            </div>

        </footer>
        <!---Footer COntents End---->


    </form>

    <script src="file:///c:\users\user\source\repos\e-commerce-first\e-commerce-first\js\bootstrap.min.js"></script>
</body>
</html>
