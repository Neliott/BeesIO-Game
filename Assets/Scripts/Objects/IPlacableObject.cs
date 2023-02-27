public interface IPlacableObject
{
    /// <summary>
    /// When the object has been placed
    /// </summary>
    public void OnPlaced();
    /// <summary>
    /// When the object must be destroyed
    /// </summary>
    public void OnDestroyNeeded();
}