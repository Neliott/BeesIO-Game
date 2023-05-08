using UnityEngine;
using System;

namespace Network
{
    /// <summary>
    /// A 2D point used for position
    /// </summary>
    public class Position:IEquatable<Position>
    {
        /// <summary>
        /// The x coordinate
        /// </summary>
        public float x;

        /// <summary>
        /// The y coordinate
        /// </summary>
        public float y;

        /// <summary>
        /// Create a 0,0 position
        /// </summary>
        public Position()
        {
            this.x = 0;
            this.y = 0;
        }

        /// <summary>
        /// Create a new position with the given values
        /// </summary>
        /// <param name="x">The x axis position</param>
        /// <param name="y">The y axis position</param>
        public Position(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        /// <summary>
        /// Create a position from a Unity Vector2 (ONLY FOR CLIENT)
        /// </summary>
        /// <param name="vector2">The vector2</param>
        public Position(Vector2 vector2)
        {
            this.x = vector2.x;
            this.y = vector2.y;
        }

        /// <summary>
        /// Translate this position with an angle and a distance
        /// </summary>
        /// <param name="directionInDegree">The direction angle in degree</param>
        /// <param name="distance">The distance to translate in the given direction</param>
        public void Translate(float directionInDegree, float distance)
        {
            float radian = directionInDegree * Mathf.Deg2Rad;
            this.x += Mathf.Cos(radian) * distance;
            this.y += Mathf.Sin(radian) * distance;
        }

        /// <summary>
        /// Convert this object to a Unity Vector2 (ONLY FOR CLIENT)
        /// </summary>
        /// <returns>The Unity Vector2</returns>
        public Vector2 ToVector2()
        {
            return new Vector2(x, y);
        }

        /// <summary>
        /// Is the other object equal ?
        /// </summary>
        /// <param name="other">The position to compare</param>
        /// <returns>True if the same position</returns>
        public bool Equals(Position other)
        {
            return other.x == this.x && other.y == this.y;
        }
    }
}