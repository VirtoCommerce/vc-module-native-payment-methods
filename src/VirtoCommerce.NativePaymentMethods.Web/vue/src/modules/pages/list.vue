<template>
  <VcBlade
    :title="$t('NATIVE_PAYMENT_METHODS.LIST.TITLE')"
    :toolbar-items="toolbar"
    :loading="loading"
    width="50%"
  >
    <VcDataTable
      v-model:search-value="keyword"
      v-model:selection="selection"
      selection-mode="multiple"
      :items="rows"
      :total-count="rows.length"
      :searchable="true"
      state-key="NATIVE_PAYMENT_METHODS"
      :active-item-id="activeId"
      :show-all-columns="!activeId"
      :empty-state="{ icon: 'lucide-banknote', title: $t('NATIVE_PAYMENT_METHODS.LIST.EMPTY') }"
      @row-click="(e: { data: NativePaymentMethod }) => open(e.data.id)"
    >
      <VcColumn
        id="logoUrl"
        :title="$t('NATIVE_PAYMENT_METHODS.FIELDS.LOGO_SHORT')"
        type="image"
        mobile-role="image"
        width="72px"
      >
        <!-- the original image: payment logos have no "_sm" thumbnails, so the built-in image cell would 404 first -->
        <template #body="{ data }">
          <VcImage
            class="vc-table-cell-image"
            :src="data.logoUrl"
            size="s"
            aspect="1x1"
            background="contain"
            empty-icon="lucide-banknote"
            bordered
          />
        </template>
      </VcColumn>
      <VcColumn
        id="name"
        :title="$t('NATIVE_PAYMENT_METHODS.FIELDS.NAME')"
        mobile-role="title"
        always-visible
      >
        <!-- name with the description under it, as the AngularJS list showed them -->
        <template #body="{ data }">
          <div class="npm-list__name">
            <span>{{ data.name }}</span>
            <small v-if="data.description">{{ data.description }}</small>
          </div>
        </template>
      </VcColumn>
      <VcColumn
        id="code"
        :title="$t('NATIVE_PAYMENT_METHODS.FIELDS.CODE')"
        mobile-role="field"
      />
      <VcColumn
        id="isEnabled"
        :title="$t('NATIVE_PAYMENT_METHODS.FIELDS.IS_ENABLED')"
        mobile-role="status"
        width="140px"
        always-visible
      >
        <template #body="{ data }">
          <div class="dash-inline">
            <VcStatus :variant="data.isEnabled ? 'success' : 'info'">
              {{ $t(data.isEnabled ? "NATIVE_PAYMENT_METHODS.LIST.ENABLED" : "NATIVE_PAYMENT_METHODS.LIST.DISABLED") }}
            </VcStatus>
          </div>
        </template>
      </VcColumn>
    </VcDataTable>
  </VcBlade>
</template>

<script setup lang="ts">
import { useAsync, useBlade, useLoading, usePopup, type IBladeToolbar } from "@vc-shell/framework";
import { VcBlade, VcColumn, VcDataTable, VcImage, VcStatus } from "@vc-shell/framework/ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, type NativePaymentMethod } from "../api";

defineBlade({
  url: "/native-payment-methods",
  name: "NativePaymentMethods",
  isWorkspace: true,
  permissions: ["NativePaymentMethods:access"],
});

const { t } = useI18n({ useScope: "global" });
const { openBlade, exposeToChildren } = useBlade();
const { showConfirmation } = usePopup();

const items = ref<NativePaymentMethod[]>([]);
const selection = ref<NativePaymentMethod[]>([]);
const activeId = ref<string>();
const keyword = ref("");

const rows = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  return k ? items.value.filter((x) => `${x.name} ${x.code} ${x.description ?? ""}`.toLowerCase().includes(k)) : items.value;
});

const { loading: loadLoading, action: load } = useAsync(async () => {
  items.value = (await api.search()).results ?? [];
});

const { loading: deleteLoading, action: remove } = useAsync<string[]>(async (ids) => {
  await api.delete(ids!);
});

const loading = useLoading(loadLoading, deleteLoading);

function open(id?: string) {
  activeId.value = id;
  openBlade({
    name: "NativePaymentMethodDetails",
    param: id,
    // the replaced blade's onClose runs after this open: clear only our own highlight
    onClose: () => activeId.value === id && (activeId.value = undefined),
  });
}

const toolbar = ref<IBladeToolbar[]>([
  { id: "refresh", title: t("NATIVE_PAYMENT_METHODS.TOOLBAR.REFRESH"), icon: "lucide-refresh-cw", clickHandler: () => load() },
  {
    id: "add",
    title: t("NATIVE_PAYMENT_METHODS.TOOLBAR.ADD"),
    icon: "lucide-plus",
    permissions: ["NativePaymentMethods:create"],
    clickHandler: () => open(),
  },
  {
    id: "delete",
    title: t("NATIVE_PAYMENT_METHODS.TOOLBAR.DELETE"),
    icon: "lucide-trash-2",
    permissions: ["NativePaymentMethods:delete"],
    disabled: computed(() => !selection.value.length),
    async clickHandler() {
      if (await showConfirmation(t("NATIVE_PAYMENT_METHODS.LIST.DELETE_CONFIRM", { count: selection.value.length }))) {
        await remove(selection.value.map((x) => x.id!));
        selection.value = [];
        await load();
      }
    },
  },
]);

load();

exposeToChildren({ reload: () => load() });
</script>

<style lang="scss">
.npm-list__name {
  display: flex;
  flex-direction: column;
  min-width: 0;
  span,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  small {
    font-size: 12px;
    color: var(--color-neutral-500);
  }
}
</style>
