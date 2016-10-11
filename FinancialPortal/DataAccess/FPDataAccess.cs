using System.Collections.Generic;
using System.Threading.Tasks;
using FinancialPortal.Models;
using Insight.Database;
using System;
using System.Data;

namespace FinancialPortal.DataAccess
{
    [Sql(Schema = "Security")]
    public interface FPDataAccess 
    {
        Task<Category> GetCategoryByIdAsync(int id);
        Category GetCategoryById(int id);
        int InsertCategory(Category category);
        Task<Account> GetAccountByIdAsync(int id);
        Account GetAccountById(int id);
        IList<int> GetAccountIdsByHousehold(Guid household);
        IList<Account> GetAccountsByHousehold(Guid household);
        IList<Transaction> GetTransactionsByAccountId(int accountid);
        IList<Category> GetCategoriesByHousehold(Guid household);
        void UpdateBudgetItem(BudgetItem budgetitem);
        void UpdateAccount(Account account);
        void UpdateTransaction(Transaction t);

        IList<Invitation> GetInvitationFromEmail(string email);
        Task InsertAccountAsync(Account account);
        void InsertAccount(Account account);
        Task<Transaction> GetTransactionByIdAsync(int id);
        void InsertTransaction(Transaction t);
        Invitation SelectInvitation(int id);

        int InsertInvitation(Invitation invitation);
        Task<BudgetItem> GetBudgetItemByIdAsync(int id);
        IList<BudgetItem> GetBudgetItemsByHousehold(Guid household);
        void InsertBudgetItem(BudgetItem budgetitem);

        void DeleteBudgetItem(int id);
        void DeleteAccount(int id);
        void DeleteTransaction(int id);


    }
}