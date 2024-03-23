-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "usernameOld" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "isOnLine" BOOLEAN NOT NULL,
    "Status" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "twoFactor" BOOLEAN NOT NULL,
    "towFactorToRedirect" BOOLEAN NOT NULL,
    "qrCodeFileName" TEXT NOT NULL,
    "towFactorSecret" TEXT NOT NULL,
    "levelGame" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryGame" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerId" TEXT NOT NULL,
    "loserId" TEXT NOT NULL,
    "startTimeGame" TIMESTAMP(3) NOT NULL,
    "endTimeGame" TIMESTAMP(3) NOT NULL,
    "scoreWinner" INTEGER NOT NULL,
    "scoreLoser" INTEGER NOT NULL,

    CONSTRAINT "HistoryGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "isProtected" BOOLEAN NOT NULL,
    "password" TEXT,
    "roomType" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "userId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "MutedUsers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanedUsers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BanedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomMessage" (
    "messageId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "RoomMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "readed" BOOLEAN NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "userOne" TEXT NOT NULL,
    "userTwo" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUsers" (
    "id" TEXT NOT NULL,
    "blockingId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,

    CONSTRAINT "BlockedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_usernameOld_key" ON "User"("usernameOld");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_chatRoomId_key" ON "Member"("userId", "chatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "MutedUsers_userId_roomId_key" ON "MutedUsers"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "BanedUsers_userId_roomId_key" ON "BanedUsers"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_userId_roomId_key" ON "Admins"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userOne_userTwo_key" ON "Friendship"("userOne", "userTwo");

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedUsers" ADD CONSTRAINT "MutedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedUsers" ADD CONSTRAINT "MutedUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanedUsers" ADD CONSTRAINT "BanedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanedUsers" ADD CONSTRAINT "BanedUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMessage" ADD CONSTRAINT "RoomMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userOne_fkey" FOREIGN KEY ("userOne") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userTwo_fkey" FOREIGN KEY ("userTwo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockingId_fkey" FOREIGN KEY ("blockingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
