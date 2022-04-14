using System.Collections.Generic;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.NativePaymentMethods.Core
{
    public static class ModuleConstants
    {
        public static class Security
        {
            public static class Permissions
            {
                public const string Access = "NativePaymentMethods:access";
                public const string Create = "NativePaymentMethods:create";
                public const string Read = "NativePaymentMethods:read";
                public const string Update = "NativePaymentMethods:update";
                public const string Delete = "NativePaymentMethods:delete";

                public static string[] AllPermissions { get; } = { Read, Create, Access, Update, Delete };
            }
        }

        public static class Settings
        {
            public static class General
            {
                public static SettingDescriptor DefaultSetting { get; } = new SettingDescriptor
                {
                    Name = "NativePaymentMethods.DefaultSetting",
                    GroupName = "NativePaymentMethods|General",
                    ValueType = SettingValueType.ShortText
                };

                public static IEnumerable<SettingDescriptor> AllSettings
                {
                    get
                    {
                        yield return DefaultSetting;
                    }
                }
            }

            public static IEnumerable<SettingDescriptor> AllSettings
            {
                get
                {
                    return General.AllSettings;
                }
            }
        }
    }
}
