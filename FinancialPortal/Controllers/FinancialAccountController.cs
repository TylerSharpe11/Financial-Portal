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



namespace FinancialPortal.Controllers
{

    
    [RoutePrefix("api/FinancialAccount")]
    public class FinancialAccountController : ApiController
    {

        public FinancialAccountController()
        {

        }
        
         // GET api/Account/UserFromEmail
        [AllowAnonymous]
        [Route("AccountsFromHousehold")]
        public Account[] AccountsFromHousehold(string household)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();
             var h = new Guid(household);

            IList<Account> i= repo.GetAccountsByHousehold(h);
            Account[] s = new Account[i.Count];
            int counter=0;
            foreach(Account a in i)
            {
                s[counter] = a;
                counter++;
            }
            return s;
        }
        [AllowAnonymous]
        [Route("UpdateAccount")]
        public void UpdateAccount(Account account)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            repo.UpdateAccount(account);
        }
        [AllowAnonymous]
        [Route("InsertAccount")]
        public void InsertAccount(string household, string name, string balance, string rbalance)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

                Account a = new Account();
                a.Household = new Guid(household);
                a.Name = name;
                a.Balance =  decimal.Parse(balance);
                a.ReconciledBalance = decimal.Parse(rbalance);
                repo.InsertAccount(a);
        }
        [AllowAnonymous]
        [Route("DAccount")]
        public void DAccount(int id)
        {
            var repo = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<FPDataAccess>();

            repo.DeleteAccount(id);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }


    }
}
