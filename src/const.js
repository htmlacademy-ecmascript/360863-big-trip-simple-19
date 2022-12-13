const POINT_TYPES = ["taxi", "bus", "train", "ship", "drive", "flight", "check-in", "sightseeing", "restaurant"];
const POINTS_COUNT = 4;

const AuthorizationError = {
    "error": 401,
    "message": "Header Authorization is not correct"
  };

const NotFoundError = {
  "error": 404,
  "message": "Not found"
}

export {POINT_TYPES, POINTS_COUNT};
