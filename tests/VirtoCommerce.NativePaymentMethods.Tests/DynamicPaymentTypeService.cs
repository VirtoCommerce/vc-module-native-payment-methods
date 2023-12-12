using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Moq;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Data.Services;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Core.Model.Search;
using VirtoCommerce.PaymentModule.Core.Services;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Settings;
using Xunit;

namespace VirtoCommerce.NativePaymentMethods.Tests
{
    public class DynamicPaymentTypeServiceTests
    {
        private readonly Fixture _fixture = new Fixture();

        private readonly Mock<ISettingsRegistrar> _settingsMock;
        private readonly Mock<IPaymentMethodsSearchService> _searchServiceMock;
        private readonly Mock<IPaymentMethodsService> _paymentServiceMock;

        public DynamicPaymentTypeServiceTests()
        {
            _settingsMock = new Mock<ISettingsRegistrar>();
            _searchServiceMock = new Mock<IPaymentMethodsSearchService>();
            _paymentServiceMock = new Mock<IPaymentMethodsService>();
        }

        [Fact]
        public async Task DeleteDynamicPaymentMethodsAsync_MethodRegistered_MethodDeleted()
        {
            // Arrange
            var target = GerService();

            var nativePaymentMethod = _fixture.Create<NativePaymentMethod>();
            var nativePaymentMethods = new List<NativePaymentMethod> { nativePaymentMethod };

            // Act
            await target.RegisterDynamicPaymentMethodsAsync(nativePaymentMethods);
            await target.DeleteDynamicPaymentMethodsAsync(nativePaymentMethods);

            // Assert
            var typeInfo = GetPaymentMethodType(nativePaymentMethod);
            typeInfo.Should().BeNull();
        }

        [Fact]
        public async Task RegisterDynamicPaymentMethodsAsync_MethodNotRegistered_MethodRegistered()
        {
            // Arrange
            var target = GerService();

            var nativePaymentMethod = _fixture.Create<NativePaymentMethod>();
            var nativePaymentMethods = new List<NativePaymentMethod> { nativePaymentMethod };

            // Act
            await target.RegisterDynamicPaymentMethodsAsync(nativePaymentMethods);

            // Assert
            var typeInfo = GetPaymentMethodType(nativePaymentMethod);
            var paymentMethod = AbstractTypeFactory<PaymentMethod>.TryCreateInstance(typeInfo.TypeName) as NativePaymentMethod;

            Assert.Equal(paymentMethod.Code, nativePaymentMethod.Code);
            Assert.Equal(paymentMethod.Name, nativePaymentMethod.Name);
            Assert.Equal(paymentMethod.LogoUrl, nativePaymentMethod.LogoUrl);
            Assert.Equal(paymentMethod.Description, nativePaymentMethod.Description);
        }

        private DynamicPaymentTypeService GerService()
        {
            _searchServiceMock
                .Setup(x => x.SearchAsync(It.IsAny<PaymentMethodsSearchCriteria>(), It.IsAny<bool>()))
                .ReturnsAsync(new PaymentMethodsSearchResult());

            var target = new DynamicPaymentTypeService(
                _settingsMock.Object,
                _searchServiceMock.Object,
                _paymentServiceMock.Object);

            return target;
        }

        private static TypeInfo<PaymentMethod> GetPaymentMethodType(NativePaymentMethod nativePaymentMethod)
        {
            return AbstractTypeFactory<PaymentMethod>
                .AllTypeInfos
                .FirstOrDefault(x => x.TypeName.Contains(nativePaymentMethod.Code));
        }
    }
}
