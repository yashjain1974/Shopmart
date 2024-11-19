from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum

class EngagementAction(str, Enum):
    VIDEO_START = "video_start"
    VIDEO_END = "video_end"
    VIDEO_PROGRESS = "video_progress"
    LIKE = "like"
    COMMENT = "comment"
    SHARE = "share"
    PRODUCT_VIEW = "product_view"
    SOUND_TOGGLE = "sound_toggle"
    BUFFERING_START = "buffering_start"
    BUFFERING_END = "buffering_end"
    SCROLL_DEPTH = "scroll_depth"
    FEED_LOADED = "feed_loaded"
    FEED_ERROR = "feed_error"

class EngagementEvent(BaseModel):
    content_id: str = Field(..., description="ID of the content being engaged with")
    action: EngagementAction = Field(..., description="Type of engagement action")
    timestamp: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    user_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "content_id": "video123",
                "action": "video_start",
                "timestamp": "2024-03-19T10:30:00Z",
                "metadata": {
                    "device_info": "iOS",
                    "app_version": "1.0.0"
                }
            }
        }

class EngagementResponse(BaseModel):
    status: str
    event_id: str

class EngagementStats(BaseModel):
    total_views: int = 0
    total_likes: int = 0
    total_comments: int = 0
    total_shares: int = 0
    avg_watch_duration: float = 0
    completion_rate: float = 0 