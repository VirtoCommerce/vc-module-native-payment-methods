using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Domain;

namespace VirtoCommerce.NativePaymentMethods.Data.Models
{
    [Index(nameof(Code), IsUnique = true)]
    public class NativePaymentMethodEntity: AuditableEntity, IDataEntity<NativePaymentMethodEntity, NativePaymentMethod>
    {
        [Required]
        [StringLength(128)]
        public string Name { get; set; }

        [Required]
        [StringLength(128)]
        public string Code { get; set; }

        [StringLength(1024)]
        public string LogoUrl { get; set; }

        [StringLength(2048)]
        public string Description { get; set; }

        [DefaultValue(true)]
        public bool IsEnabled { get; set; } = true;
        

        public NativePaymentMethod ToModel(NativePaymentMethod model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            model.Id = Id;
            model.Code = Code;
            model.LogoUrl = LogoUrl;
            model.Description = Description;
            model.Name = Name;
            model.IsEnabled = IsEnabled;

            return model;
        }

        public NativePaymentMethodEntity FromModel(NativePaymentMethod model, PrimaryKeyResolvingMap pkMap)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            pkMap.AddPair(model, this);

            Id = model.Id;
            Code = model.Code;
            LogoUrl = model.LogoUrl;
            Description = model.Description;
            Name = model.Name;
            IsEnabled = model.IsEnabled;

            return this;
        }

        public void Patch(NativePaymentMethodEntity target)
        {
            if (target == null)
            {
                throw new ArgumentNullException(nameof(target));
            }

            target.Code = Code;
            target.LogoUrl = LogoUrl;
            target.Description = Description;
            target.Name = Name;
            target.IsEnabled = IsEnabled;
        }
    }
}
