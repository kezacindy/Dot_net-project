using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace E_Commerce_First
{
    public partial class SignIn : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Request.Cookies["UNAME"] != null && Request.Cookies["UPWD"] != null)
                {
                    txtEmail.Text = Request.Cookies["UNAME"].Value;
                    txtPass.Attributes["value"] = Request.Cookies["UPWD"].Value;
                    CheckBox1.Checked = true;
                }
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            string hashedPassword = HashPassword(txtPass.Text);

            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["MyShoppingDB"].ConnectionString))
            {
                con.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM tblUsers WHERE Email = @Email AND Password = @pwd", con);
                cmd.Parameters.AddWithValue("@Email", txtEmail.Text);
                cmd.Parameters.AddWithValue("@pwd", hashedPassword);

                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                if (dt.Rows.Count != 0)
                {
                    Session["USERID"] = dt.Rows[0]["Uid"].ToString();
                    Session["USEREMAIL"] = dt.Rows[0]["Email"].ToString();

                    // Cookies for remember me
                    if (CheckBox1.Checked)
                    {
                        Response.Cookies["UNAME"].Value = txtEmail.Text;
                        Response.Cookies["UPWD"].Value = txtPass.Text; // NOTE: Still plain, for convenience only
                        Response.Cookies["UNAME"].Expires = DateTime.Now.AddDays(10);
                        Response.Cookies["UPWD"].Expires = DateTime.Now.AddDays(10);
                    }
                    else
                    {
                        Response.Cookies["UNAME"].Expires = DateTime.Now.AddDays(-1);
                        Response.Cookies["UPWD"].Expires = DateTime.Now.AddDays(-1);
                    }

                    string Utype = dt.Rows[0]["Usertype"].ToString().Trim();

                    if (Utype == "User")
                    {
                        Session["Username"] = txtEmail.Text;
                        Session["getFullName"] = dt.Rows[0]["Name"].ToString();
                        Session["LoginType"] = "User";

                        if (Request.QueryString["rurl"] != null)
                        {
                            if (Request.QueryString["rurl"] == "cart")
                            {
                                Response.Redirect("Cart.aspx");
                            }

                            if (Request.QueryString["rurl"] == "PID")
                            {
                                string myPID = Session["ReturnPID"].ToString();
                                Response.Redirect("ProductView.aspx?PID=" + myPID);
                            }
                        }
                        else
                        {
                            Response.Redirect("UserHome.aspx?UserLogin=YES");
                        }
                    }
                    else if (Utype == "Admin")
                    {
                        Session["Username"] = txtEmail.Text;
                        Session["LoginType"] = "Admin";
                        Response.Redirect("~/AdminHome.aspx");
                    }

                    Response.Write("<script> alert('Login Successful'); </script>");
                    clr();
                }
                else
                {
                    lblError.Text = "Invalid Username or Password";
                }

                con.Close();
            }
        }

        private void clr()
        {
            txtPass.Text = string.Empty;
            txtEmail.Text = string.Empty;
            txtEmail.Focus();
        }

        // 🔒 Same SHA256 method as used in SignUp
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
