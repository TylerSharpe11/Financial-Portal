namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Security.BudgetItems")]
    public partial class BudgetItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        public Guid Household { get; set; }

        public int CategoryId { get; set; }

        public string Amount { get; set; }
        public int? AnnualFrequency { get; set; }

        public virtual Category Category { get; set; }
    }
}
