const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// CREATE DIARY ENTRY
const createDiary = async (req, res) => {
  try {
    const { title, content, mood, tags,template, is_locked, entry_password } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    let hashedEntryPassword = null;

    if (is_locked) {
      if (!entry_password) {
        return res.status(400).json({
          message: "Password is required for locked diary",
        });
      }

      hashedEntryPassword = await bcrypt.hash(entry_password, 10);
    }

    const result = await pool.query(
      `INSERT INTO diary_entries
       (user_id, title, content, mood, tags, template, is_locked, entry_password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, title, content, mood, tags, template, is_locked, is_favorite, is_deleted, created_at, updated_at`,
      [
        userId,
        title,
        content,
        mood || null,
        tags || null,
        template || "classic",
        is_locked || false,
        hashedEntryPassword,
      ]
    );
    res.status(201).json({
      message: "Diary entry created successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Create Diary Error:", error);
    res.status(500).json({
      message: "Server error while creating diary",
    });
  }
};

// GET ALL DIARY ENTRIES OF LOGGED-IN USER
const getMyDiaries = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, title, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at
       FROM diary_entries
       WHERE user_id = $1 AND is_deleted = false
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      message: "Diaries fetched successfully",
      diaries: result.rows,
    });
  } catch (error) {
    console.error("Get Diaries Error:", error);
    res.status(500).json({
      message: "Server error while fetching diaries",
    });
  }
};

// GET SINGLE DIARY ENTRY
const getSingleDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, user_id, title, content, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at
       FROM diary_entries
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    const diary = result.rows[0];

    if (diary.is_locked) {
      return res.status(200).json({
        message: "Diary is locked",
        diary: {
          id: diary.id,
          title: diary.title,
          mood: diary.mood,
          tags: diary.tags,
          is_locked: diary.is_locked,
          is_favorite: diary.is_favorite,
          created_at: diary.created_at,
          updated_at: diary.updated_at,
        },
      });
    }

    res.status(200).json({
      message: "Diary fetched successfully",
      diary,
    });
  } catch (error) {
    console.error("Get Single Diary Error:", error);
    res.status(500).json({
      message: "Server error while fetching diary",
    });
  }
};

// UNLOCK LOCKED DIARY ENTRY
const unlockDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;
    const { entry_password } = req.body;

    if (!entry_password) {
      return res.status(400).json({
        message: "Diary password is required",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM diary_entries
       WHERE id = $1 AND user_id = $2 AND is_deleted = false`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    const diary = result.rows[0];

    if (!diary.is_locked) {
      return res.status(200).json({
        message: "Diary is not locked",
        diary,
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      entry_password,
      diary.entry_password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect diary password",
      });
    }

    delete diary.entry_password;

    res.status(200).json({
      message: "Diary unlocked successfully",
      diary,
    });
  } catch (error) {
    console.error("Unlock Diary Error:", error);
    res.status(500).json({
      message: "Server error while unlocking diary",
    });
  }
};
// UPDATE DIARY ENTRY
const updateDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const { title, content, mood, tags, is_locked, entry_password } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    let hashedEntryPassword = null;

    if (is_locked) {
      if (entry_password) {
        hashedEntryPassword = await bcrypt.hash(entry_password, 10);
      }
    }

    let result;

    if (is_locked && hashedEntryPassword) {
      result = await pool.query(
        `UPDATE diary_entries
         SET title = $1,
             content = $2,
             mood = $3,
             tags = $4,
             is_locked = $5,
             entry_password = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 AND user_id = $8 AND is_deleted = false
         RETURNING id, user_id, title, content, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at`,
        [title, content, mood, tags, is_locked, hashedEntryPassword, diaryId, userId]
      );
    } else {
      result = await pool.query(
        `UPDATE diary_entries
         SET title = $1,
             content = $2,
             mood = $3,
             tags = $4,
             is_locked = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND user_id = $7 AND is_deleted = false
         RETURNING id, user_id, title, content, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at`,
        [title, content, mood, tags, is_locked || false, diaryId, userId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    res.status(200).json({
      message: "Diary updated successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Update Diary Error:", error);
    res.status(500).json({
      message: "Server error while updating diary",
    });
  }
};

// SOFT DELETE DIARY ENTRY
const deleteDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE diary_entries
       SET is_deleted = true,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, is_deleted`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    res.status(200).json({
      message: "Diary moved to trash successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Delete Diary Error:", error);
    res.status(500).json({
      message: "Server error while deleting diary",
    });
  }
};

// TOGGLE FAVORITE DIARY
const toggleFavoriteDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE diary_entries
       SET is_favorite = NOT is_favorite,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND is_deleted = false
       RETURNING id, title, is_favorite`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    res.status(200).json({
      message: "Favorite status updated successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Favorite Diary Error:", error);
    res.status(500).json({
      message: "Server error while updating favorite",
    });
  }
};
// GET TRASH DIARIES
const getTrashDiaries = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, title, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at
       FROM diary_entries
       WHERE user_id = $1 AND is_deleted = true
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.status(200).json({
      message: "Trash diaries fetched successfully",
      diaries: result.rows,
    });
  } catch (error) {
    console.error("Get Trash Diaries Error:", error);
    res.status(500).json({
      message: "Server error while fetching trash diaries",
    });
  }
};

// RESTORE DIARY FROM TRASH
const restoreDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE diary_entries
       SET is_deleted = false,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2 AND is_deleted = true
       RETURNING id, title, is_deleted`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trash diary not found",
      });
    }

    res.status(200).json({
      message: "Diary restored successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Restore Diary Error:", error);
    res.status(500).json({
      message: "Server error while restoring diary",
    });
  }
};

// PERMANENT DELETE DIARY
const permanentDeleteDiary = async (req, res) => {
  try {
    const diaryId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM diary_entries
       WHERE id = $1 AND user_id = $2 AND is_deleted = true
       RETURNING id, title`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trash diary not found",
      });
    }

    res.status(200).json({
      message: "Diary permanently deleted successfully",
      diary: result.rows[0],
    });
  } catch (error) {
    console.error("Permanent Delete Diary Error:", error);
    res.status(500).json({
      message: "Server error while permanently deleting diary",
    });
  }
};
// SEARCH / FILTER DIARIES
const searchDiaries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { keyword, mood, favorite } = req.query;

    let query = `
      SELECT id, title, mood, tags, is_locked, is_favorite, is_deleted, created_at, updated_at
      FROM diary_entries
      WHERE user_id = $1 AND is_deleted = false
    `;

    const values = [userId];
    let count = 2;

    if (keyword) {
      query += ` AND (title ILIKE $${count} OR content ILIKE $${count} OR tags ILIKE $${count})`;
      values.push(`%${keyword}%`);
      count++;
    }

    if (mood) {
      query += ` AND mood = $${count}`;
      values.push(mood);
      count++;
    }

    if (favorite === "true") {
      query += ` AND is_favorite = true`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "Diaries searched successfully",
      diaries: result.rows,
    });
  } catch (error) {
    console.error("Search Diaries Error:", error);
    res.status(500).json({
      message: "Server error while searching diaries",
    });
  }
};

// DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM diary_entries
       WHERE user_id = $1 AND is_deleted = false`,
      [userId]
    );

    const lockedResult = await pool.query(
      `SELECT COUNT(*) FROM diary_entries
       WHERE user_id = $1 AND is_locked = true AND is_deleted = false`,
      [userId]
    );

    const favoriteResult = await pool.query(
      `SELECT COUNT(*) FROM diary_entries
       WHERE user_id = $1 AND is_favorite = true AND is_deleted = false`,
      [userId]
    );

    const trashResult = await pool.query(
      `SELECT COUNT(*) FROM diary_entries
       WHERE user_id = $1 AND is_deleted = true`,
      [userId]
    );

    const moodResult = await pool.query(
      `SELECT mood, COUNT(*)
       FROM diary_entries
       WHERE user_id = $1 AND is_deleted = false AND mood IS NOT NULL
       GROUP BY mood
       ORDER BY COUNT(*) DESC`,
      [userId]
    );

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalDiaries: Number(totalResult.rows[0].count),
        lockedDiaries: Number(lockedResult.rows[0].count),
        favoriteDiaries: Number(favoriteResult.rows[0].count),
        trashDiaries: Number(trashResult.rows[0].count),
        moodStats: moodResult.rows,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard stats",
    });
  }
};
module.exports = {
  createDiary,
  getMyDiaries,
  getSingleDiary,
  unlockDiary,
  updateDiary,
  deleteDiary,
  toggleFavoriteDiary,
  getTrashDiaries,
  restoreDiary,
  permanentDeleteDiary,
  searchDiaries,
  getDashboardStats,
};