using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraTracker : MonoBehaviour
{
    [SerializeField]
    float _smoothSpeed;

    Transform _trackedObject;

    /// <summary>
    /// The current object that is tracked by the camera
    /// </summary>
    public Transform TrackedObject
    {
        get { return _trackedObject; }
        set { _trackedObject = value; }
    }

    void Update()
    {
        if (_trackedObject == null) return;
        transform.position = Vector3.Lerp(transform.position, new Vector3(_trackedObject.position.x, _trackedObject.position.y, transform.position.z), _smoothSpeed * Time.deltaTime);
    }
}
