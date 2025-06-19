const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const GUILD_ID = process.env.GUILD_ID || "1287350045917581355";

// Middleware
app.use(cors());

// Route kiểm tra
app.get("/", (req, res) => {
  res.send("🟢 Bot đang hoạt động!");
});

// Route lấy trạng thái Discord
app.get("/discord-status", async (req, res) => {
  const userId = req.query.user;
  if (!userId) return res.status(400).json({ error: "Thiếu userId" });

  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    // Tải member
    let member = guild.members.cache.get(userId);
    if (!member) {
      member = await guild.members.fetch(userId);
    }

    // Lấy presence
    const presence = member.presence;

    res.json({
      username: member.user.username,
      avatar: member.user.displayAvatarURL({ dynamic: true, size: 128 }),
      status: presence?.status || "offline",
      activity: presence?.activities?.[0]?.name || "Không hoạt động",
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy trạng thái:", err);
    res.status(500).json({ error: "Lỗi xử lý" });
  }
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`🌐 Server chạy tại http://localhost:${PORT}`);
});

// Khởi tạo Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.User, Partials.GuildMember],
});

// Đăng nhập bot
client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`🤖 Bot online: ${client.user.tag}`);
});

client.on("error", console.error);
process.on("unhandledRejection", console.error);

// Keep alive log
setInterval(() => {
  console.log("⏰ Bot vẫn hoạt động...");
}, 1000 * 60 * 5);
