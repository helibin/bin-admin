<template>
  <el-table-column :label="$t('common.time')">
    <template slot-scope="{ row }">
      {{ $t('common.createdAt') }}: <span v-if="row.created_at"> {{ row.created_at | parseTime() }} </span><br />
      {{ $t('common.updatedAt') }}:
      <span v-if="row.updated_at">
        {{ row.updated_at | parseTime() }}
      </span>
    </template>
  </el-table-column>
</template>
