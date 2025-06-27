class Warehouse_card(DbModel):
    """ warehouse_card """
    id = fields.IntField(pk=True, description="主键")
    id = fields.IntField(, null=False), description="主键"
    commodity_id = fields.IntField(, null=False), description="关联商品ID"
    title = fields.TextField(, null=False, max_length=255), description="卡号 / 卡密内容"
    password = fields.TextField(, null=False, max_length=255, default=''), description="卡密密码（如无可留空）"
    is_used = fields.SmallIntField(, null=False, default=0), description="是否已使用: [0=否, 1=是]"
    order_id = fields.SmallIntField(, null=False, default=0), description="关联订单ID（使用后记录）"
    use_time = fields.SmallIntField(, null=False, default=0), description="使用时间（时间戳）"
    card_type = fields.SmallIntField(, null=False, default=0), description="卡密类型: [0=唯一, 1=共享库存, 2=无限库存]"
    stock = fields.SmallIntField(, null=False, default=0), description="共享库存数量，仅在 card_type=1 时有效"
    is_delete = fields.SmallIntField(, null=False, default=0), description="是否删除"
    create_time = fields.SmallIntField(, null=False, default=0), description="创建时间"
    create_time = fields.IntField(null=False, default=0, description="创建时间")
    update_time = fields.IntField(null=False, default=0, description="更新时间")
    delete_time = fields.IntField(null=False, default=0, description="删除时间")

    class Meta:
        table_description = "warehouse_card表"
        table = DbModel.table_prefix("warehouse_card")