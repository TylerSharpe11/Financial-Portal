using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web.Http;
using Insight.Database;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using FinancialPortal.Models;
using FinancialPortal.Providers;
using FinancialPortal.DataAccess;
using FinancialPortal.Infrastructure;
using FinancialPortal;
using FinancialPortal.Results;
using System.Reflection;
using System.Data.Common;
using System.Configuration;
using Newtonsoft.Json;
using System.Net.Mail;



namespace FinancialPortal.Controllers
{

    
    [RoutePrefix("api/Transaction")]
    public class TransactionController : ApiController
    {

        public TransactionController()
        {
            
            
             
        }
        

        [AllowAnonymous]
        [Route("InsertTransaction")]
        public void InsertTransaction(int accountid, string amount, string description, int categoryid)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Account a=repo.GetAccountById(accountid);
            Decimal d=Convert.ToDecimal(amount);
            a.Balance = a.Balance - d;
            repo.UpdateAccount(a);
            Transaction t = new Transaction();
            t.AccountId = accountid;
            t.Amount = amount;
            t.CategoryId = categoryid;

            t.Date = DateTime.Now;
            t.Description = description;
            t.AbsAmount = amount;

            repo.InsertTransaction(t);
        }

        [AllowAnonymous]
        [Route("InsertTransactionAndCategory")]
        public void InsertTransactionAndCategory(int accountid, string household, string amount, string description, string categoryname)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Account acc=repo.GetAccountById(accountid);
            Decimal d=Convert.ToDecimal(amount);
            acc.Balance = acc.Balance - d;
            repo.UpdateAccount(acc);
            Category c = new Category();
            Decimal a = Convert.ToDecimal(amount);
            c.Name = categoryname;
            c.Household = new Guid(household);
            int categoryid=repo.InsertCategory(c);
            Transaction t = new Transaction();
            t.AccountId = accountid;
            t.Amount = amount;
            t.CategoryId = categoryid;
            t.Date = DateTime.Now;
            t.Description = description;
            t.AbsAmount = amount;

            repo.InsertTransaction(t);
        }

        [AllowAnonymous]
        [Route("FindTransactionsbyAccountId")]
        public Transaction[] FindTransactionsbyAccountId(int accountid)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            IList<Transaction> i=repo.GetTransactionsByAccountId(accountid);
            Transaction[] s = new Transaction[i.Count];
            int counter = 0;
            foreach (Transaction a in i)
            {
                a.Category = FindCategoryById(a.CategoryId);
                s[counter] = a;
                counter++;
            }
            return s;
        }
        [AllowAnonymous]
        [Route("FindTransactionsbyHousehold")]
        public Transaction[] FindTransactionsbyHousehold(string Household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Guid h = new Guid(Household);

            IList<int> i = repo.GetAccountIdsByHousehold(h);
             List<Transaction> t=new List<Transaction>();

             foreach (int id in i)
             {
                 t.AddRange(repo.GetTransactionsByAccountId(id));
             }
            foreach(Transaction tr in t)
            {
                tr.Category = repo.GetCategoryById(tr.CategoryId);
            }
            return t.ToArray();
        }
        [AllowAnonymous]
        [Route("FindRecentTransactions")]
        public Transaction[] FindRecentTransactions(string household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Guid h = new Guid(household);
            IList<Account> i = repo.GetAccountsByHousehold(h);

            List<Transaction> s = new List<Transaction>();
            foreach (Account a in i)
            {
                var list = FindTransactionsbyAccountId(a.Id);
                foreach(Transaction t in list)
                {
                    t.Account = a;
                }
                s.AddRange(list);
            }
            s.Sort((x, y) => DateTime.Compare(x.Date, y.Date));
            List<Transaction> tray = new List<Transaction>();

            for (int j = 0; j < 5 && j<s.Count;j++)
            {
                tray.Add(s[j]);
            }
                return tray.ToArray();
        }

        [AllowAnonymous]
        [Route("FindCategoriesByHousehold")]
        public Category[] FindCategoriesByHousehold(string household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Guid h = new Guid(household);
            IList<Category> i = repo.GetCategoriesByHousehold(h);
            Category c = new Category();
            c.Name = "Create New Category";
            c.Household = h;
            i.Add(c);
            Category[] s = new Category[i.Count];
            int counter = 0;
            foreach (Category a in i)
            {
                s[counter] = a;
                counter++;
            }

            return s;
        }
        [AllowAnonymous]
        [Route("FindCategoryById")]
        public Category FindCategoryById(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Category c = repo.GetCategoryById(id);
            return c;

        }

        [AllowAnonymous]
        [Route("FindBudgetItemsByHousehold")]
        public BudgetItem[] FindBudgetItemsByHousehold(string household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Guid h = new Guid(household);
            IList<BudgetItem> i = repo.GetBudgetItemsByHousehold(h);

            BudgetItem[] s = new BudgetItem[i.Count];
            int counter = 0;
            foreach (BudgetItem a in i)
            {
                s[counter] = a;
                counter++;
            }
            return s;
        }
         [AllowAnonymous]
         [Route("FindExpensesByHousehold")]
        public BudgetItem[] FindExpensesByHousehold(string household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            Guid h = new Guid(household);
            IList<BudgetItem> i = repo.GetBudgetItemsByHousehold(h);


            List<BudgetItem> s = new List<BudgetItem>();
            foreach (BudgetItem a in i)
            {
                if (decimal.Parse(a.Amount) > 0)
                {
                    continue;
                }
                a.Category = FindCategoryById(a.CategoryId);
                s.Add(a);
            }
            return s.ToArray();
        }
         [AllowAnonymous]
         [Route("FindIncomeByHousehold")]
         public BudgetItem[] FindIncomeByHousehold(string household)
         {
             var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
             Guid h = new Guid(household);
             IList<BudgetItem> i = repo.GetBudgetItemsByHousehold(h);

             List<BudgetItem> s = new List<BudgetItem>();
             foreach (BudgetItem a in i)
             {
                 if (decimal.Parse(a.Amount) < 0)
                 {
                     continue;
                 }
                 a.Category = FindCategoryById(a.CategoryId);
                 s.Add(a);
             }
             return s.ToArray();
         }
        


        [AllowAnonymous]
        [Route("InsertBudgetItemAndCategory")]
         public void InsertBudgetItemAndCategory(string household, string amount, string categoryname, int annualfrequency)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            Category c = new Category();
            c.Name = categoryname;
            c.Household = new Guid(household);
            int categoryid = repo.InsertCategory(c);
            BudgetItem t = new BudgetItem();
            t.Amount = amount;
            t.CategoryId = categoryid;
            t.AnnualFrequency = annualfrequency;
            t.Household = new Guid(household);
            repo.InsertBudgetItem(t);
        }
        [AllowAnonymous]
        [Route("InsertBudgetItem")]
        public void InsertBudgetItem(string household, string amount, int categoryid, int annualfrequency)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            BudgetItem t = new BudgetItem();
            t.Amount = amount;
            t.CategoryId = categoryid;
            t.AnnualFrequency = annualfrequency;
            t.Household = new Guid(household);
            repo.InsertBudgetItem(t);
        }

        [AllowAnonymous]
        [Route("UpdateTransaction")]
        public void UpdateTransaction(Transaction transaction, int userid)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            transaction.UpdatedByUserId = userid;
            transaction.Updated = DateTime.Now;
            repo.UpdateTransaction(transaction);
        }
        [AllowAnonymous]
        [Route("UpdateBudgetItem")]
        public void UpdateBudgetItem(BudgetItem budgetitem)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            repo.UpdateBudgetItem(budgetitem);
        }
        [AllowAnonymous]
        [Route("InsertInvite")]
        public string InsertInvite(string household,int userid, string email)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            Invitation t = new Invitation();
            Random rnd = new Random();
            int hash = rnd.Next(1, 99999); // creates a number between 1 and 99999
            t.SecurityHash = hash.ToString();
            t.FromUserId = userid;
            t.ToEmail = email;
            Guid h = new Guid(household);    


            t.Household = h;

            int id=repo.InsertInvitation(t);

            return h.ToString();
        }
        
        [AllowAnonymous]
        [Route("seeInvite")]
        public Invitation seeInvite(string email)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
            var urepo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<IUserDataAccess>();

            IList<Invitation> t = repo.GetInvitationFromEmail(email);

            foreach(Invitation i in t)
            {
                if(i.Accepted==null)
                {
                    return i;
                }
            }

            return null;
            

        }
        [AllowAnonymous]
        [Route("AcceptInvite")]
        public string AcceptInvite(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            Invitation t = new Invitation();
            t = repo.SelectInvitation(id);
            Guid h= t.Household;
            t.Accepted = true;

            var urepo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<IUserDataAccess>();
            User u=urepo.FindUserByEmail(t.ToEmail);
            u.Household = h;
            urepo.UpdateUser(u);
            return h.ToString();

        }
        [AllowAnonymous]
        [Route("DeclineInvite")]
        public void DeclineInvite(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            Invitation t = new Invitation();
            t = repo.SelectInvitation(id);
            Guid h = t.Household;
            t.Accepted = false;

        }
        

        [AllowAnonymous]
        [Route("DBudgetItem")]
        public void DBudgetItem(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            repo.DeleteBudgetItem(id);
        }
        [AllowAnonymous]
        [Route("DTransaction")]
        public void DTransaction(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            repo.DeleteTransaction(id);
        }
        public void notify(string email, int id, string hash)
        {
            try
            {
                string from = "";
                //Replace this with your own correct Gmail Address

                string to = email;
                //Replace this with the Email Address 
                //to whom you want to send the mail
                string url = "http://localhost:5768/acceptinvite/";
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                mail.To.Add(to);
                mail.From = new MailAddress(from, "Admin", System.Text.Encoding.UTF8);
                mail.Subject = "You've been invited to a Household";
                mail.SubjectEncoding = System.Text.Encoding.UTF8;
                mail.Body = "To join household follow this link " + url + id.ToString()+"/"+hash ;
                mail.BodyEncoding = System.Text.Encoding.UTF8;
                mail.IsBodyHtml = true;
                mail.Priority = MailPriority.High;

                SmtpClient client = new SmtpClient("smtp.gmail.com", 587);

                //Add the Creddentials- use your own email id and password
                System.Net.NetworkCredential nt =
                new System.Net.NetworkCredential(from, "SuperSecret");

                client.Port = 587; // Gmail works on this port
                client.EnableSsl = true; //Gmail works on Server Secured Layer
                client.UseDefaultCredentials = false;
                client.Credentials = nt;
                client.Send(mail);

            }
            catch (Exception ex)
            {

            }
        }
    }
}
