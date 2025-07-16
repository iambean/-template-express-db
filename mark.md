
1. Sequelize 在执行 create 时，如果有 NOT NULL 字段且没有默认值，且你没有传值，Sequelize 会在校验阶段直接报错，而不会进入 hooks。
这是 Sequelize 的一个“坑”：
如果你在模型定义时，某个字段 allowNull: false，但没有 defaultValue，也没有在 create 时传值，Sequelize 会先校验字段，校验不通过直接抛错，不会执行 hooks。